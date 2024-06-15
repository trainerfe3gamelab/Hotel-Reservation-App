import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql";
import authRoutes from "./routes/Auth.js";
import userRoutes from "./routes/users.js";
import cookieParser from "cookie-parser";
import myHotelsRoutes from "./routes/my-hotels.js";
import { v2 as cloudinary} from "cloudinary";
import hotelRoutes from "./routes/hotels.js";
import bookingRoutes from "./routes/my-bookings.js";
import profileRoutes from "./routes/profile.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

export const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the MySQL database.');
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hotels", myHotelsRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/my-bookings", bookingRoutes);
app.use("/api/profile", profileRoutes)

app.listen(7000, () => {
  console.log("Server started on port 7000");
});