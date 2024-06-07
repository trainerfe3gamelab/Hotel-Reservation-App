import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql";
import authRoutes from "./routes/Auth.js";
import userRoutes from "./routes/users.js";
import cookieParser from "cookie-parser";

// Initialize dotenv to use .env variables
dotenv.config();

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

const db = mysql.createConnection({
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
app.use("/api/user", userRoutes);

app.listen(7000, () => {
  console.log("Server started on port 7000");
});
