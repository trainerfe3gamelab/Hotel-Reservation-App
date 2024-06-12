import express from "express";
import Hotel from "../models/hotel.js";
import { validationResult } from "express-validator";
import Stripe from "stripe";
import verifyToken from "../middleware/auth.js";
import mysql from "mysql2/promise";

const stripe = new Stripe(process.env.STRIPE_API_KEY);

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
  
      // Sorting
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
      const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
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
  
  export default router;
