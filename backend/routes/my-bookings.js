import express from "express";
import verifyToken from "../middleware/auth.js";
import { Hotel, Booking } from "../models/hotel.js";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: {
        userId: req.userId
      },
      attributes: ["hotelId", "adultCount", "childrenCount", "checkIn", "checkOut", "rating"],
    });

    const hotelIds = bookings.map(booking => booking.hotelId);
    const hotels = await Hotel.findAll({
      where: {
        hotelId: hotelIds 
      }
    });

    const mappedResults = hotels.map(hotel => ({
      hotelId: hotel.hotelId,
      name: hotel.name,
      city: hotel.city,
      country: hotel.country,
      starRating: hotel.starRating,
      pricePerNight: hotel.pricePerNight,
      imageUrls: hotel.imageUrls,
      bookings: bookings.filter(booking => booking.hotelId === hotel.hotelId) 
    }));

    res.status(200).json(mappedResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch bookings" });
  }
});

export default router;
