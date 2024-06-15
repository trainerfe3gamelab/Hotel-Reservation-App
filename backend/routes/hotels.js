import express from "express";
import { Hotel, Booking } from "../models/hotel.js";
import Stripe from "stripe";
import verifyToken from "../middleware/auth.js";
import mysql from "mysql2/promise";
import Sequelize from "sequelize";

const { Op } = Sequelize;

const stripe = new Stripe(
  "sk_test_51PPQVXP01Wr75qZsuiG9XvZpCfPxcW5W3MoOH8S19XvfrNLFVoBY5P7zYlQCuoBy2miutulc5axAcQHVtV3QT9tO00fOQfQ2sV"
);

const router = express.Router();

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "capstone",
});

const constructSearchQuery = (queryParams) => {
  let query = "SELECT * FROM hotels WHERE 1=1";
  let params = [];

  if (queryParams.destination) {
    query += " AND (city LIKE ? OR country LIKE ?)";
    params.push(`%${queryParams.destination}%`, `%${queryParams.destination}%`);
  }

  if (queryParams.adultCount) {
    query += " AND adultCount >= ?";
    params.push(parseInt(queryParams.adultCount));
  }

  if (queryParams.childrenCount) {
    query += " AND childrenCount >= ?";
    params.push(parseInt(queryParams.childrenCount));
  }

  if (queryParams.facilities) {
    query += " AND JSON_CONTAINS(facilities, ?)";
    const facilities = Array.isArray(queryParams.facilities)
      ? JSON.stringify(queryParams.facilities)
      : JSON.stringify([queryParams.facilities]);
    params.push(facilities);
  }

  if (queryParams.types) {
    const types = Array.isArray(queryParams.types)
      ? queryParams.types
      : [queryParams.types];
    query += ` AND type IN (${types.map(() => "?").join(", ")})`;
    params.push(...types);
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star) => parseInt(star))
      : [parseInt(queryParams.stars)];
    query += ` AND starRating IN (${starRatings.map(() => "?").join(", ")})`;
    params.push(...starRatings);
  }

  if (queryParams.maxPrice) {
    query += " AND pricePerNight <= ?";
    params.push(parseFloat(queryParams.maxPrice));
  }

  return { query, params };
};

router.get("/search", async (req, res) => {
  try {
    const { query, params } = constructSearchQuery(req.query);
    let sortOptions = "";
    switch (req.query.sortOption) {
      case "starRatingDesc":
        sortOptions = "ORDER BY starRating DESC";
        break;
      case "starRatingAsc":
        sortOptions = "ORDER BY starRating ASC";
        break;
      case "pricePerNightAsc":
        sortOptions = "ORDER BY pricePerNight ASC";
        break;
      case "pricePerNightDesc":
        sortOptions = "ORDER BY pricePerNight DESC";
        break;
    }

    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );
    const offset = (pageNumber - 1) * pageSize;

    const pagination = `LIMIT ${pageSize} OFFSET ${offset}`;

    const finalQuery = `${query} ${sortOptions} ${pagination}`;

    const connection = await pool.getConnection();

    const countQuery = `SELECT COUNT(*) as total FROM (${query}) as countQuery`;
    const [countResult] = await connection.query(countQuery, params);
    const total = countResult[0].total;

    const [hotels] = await connection.query(finalQuery, params);

    connection.release();

    const response = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.json(response);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const query = "SELECT * FROM hotels ORDER BY lastUpdated DESC";
    const [results] = await connection.query(query);
    connection.release();
    res.json(results);
  } catch (error) {
    console.error("Error fetching hotels from MySQL database:", error);
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const id = req.params.id.toString();
    const query = "SELECT * FROM hotels WHERE hotelId = ?";
    const [results] = await connection.query(query, [id]);
    connection.release();

    if (results.length === 0) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.json(results[0]);
  } catch (error) {
    console.error("Error fetching hotel from MySQL database:", error);
    res.status(500).json({ message: "Error fetching hotel" });
  }
});

router.post(
  "/:hotelId/booking/payment-intent",
  verifyToken,
  async (req, res) => {
    const { numberOfNights } = req.body;
    const hotelId = req.params.hotelId;

    try {
      const hotel = await Hotel.findByPk(hotelId);
      if (!hotel) {
        return res.status(400).json({ message: "Hotel not found" });
      }

      const totalCost = hotel.pricePerNight * numberOfNights;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalCost * 100,
        currency: "usd",
        metadata: {
          hotelId,
          userId: req.userId,
        },
      });

      if (!paymentIntent.client_secret) {
        return res
          .status(500)
          .json({ message: "Error creating payment intent" });
      }

      const response = {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret.toString(),
        totalCost,
      };

      res.send(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post("/:hotelId/booking", verifyToken, async (req, res) => {
  try {
    const paymentIntentId = req.body.paymentIntentId;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent) {
      return res.status(400).json({ message: "payment intent not found" });
    }

    if (
      paymentIntent.metadata.hotelId !== req.params.hotelId ||
      paymentIntent.metadata.userId !== req.userId
    ) {
      return res.status(400).json({ message: "payment intent mismatch" });
    }

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        message: `payment intent not succeeded. Status: ${paymentIntent.status}`,
      });
    }

    const newBooking = {
      ...req.body,
      userId: req.userId,
    };

    const hotel = await Hotel.findOne({
      where: { hotelId: req.params.hotelId },
    });

    if (!hotel) {
      return res.status(400).json({ message: "hotel not found" });
    }

    await Booking.create(newBooking);

    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

router.post("/:hotelId/rating", verifyToken, async (req, res) => {
  const { hotelId } = req.params;
  let { rating } = req.body;

  if (typeof rating !== 'number' || isNaN(rating)) {
    return res.status(400).json({ error: 'Rating must be a valid number' });
  }

  rating = parseFloat(rating);

  try {
    const userId = req.userId;

    const hotel = await Hotel.findByPk(hotelId);

    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    const booking = await Booking.findOne({
      where: {
        hotelId: hotelId,
        userId: userId
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.rating = rating;
    await booking.save();

    const averageRating = await Booking.findOne({
      attributes: [
        [Sequelize.fn('AVG', Sequelize.col('rating')), 'avgRating']
      ],
      where: {
        hotelId: hotelId,
        rating: {
          [Op.not]: null
        }
      }
    });

    hotel.ratingSum = averageRating.avgRating;
    await hotel.save();

    res.status(201).json({ message: 'Rating added successfully', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:hotelId/ratingAvg', async (req, res) => {
  const { hotelId } = req.params;

  try {
    const averageRatings = await Booking.findAll({
      attributes: [
        'hotelId',
        [Sequelize.fn('AVG', Sequelize.col('rating')), 'avgRating'],
        [Sequelize.fn('COUNT', Sequelize.col('rating')), 'numUsers'] 
      ],
      where: {
        hotelId,
        rating: {
          [Op.not]: null
        }
      },
      group: ['hotelId'],
    });

    if (!averageRatings.length) {
      return res.status(404).json({ error: 'No ratings found for this hotel' });
    }

    const { avgRating, numUsers } = averageRatings[0].dataValues;
    res.json({ avgRating, numUsers }); 
  } catch (error) {
    console.error('Failed to fetch average ratings:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



export default router;
