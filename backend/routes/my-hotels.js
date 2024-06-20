import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Hotel } from "../models/hotel.js";
import verifyToken from "../middleware/auth.js";
import { body } from "express-validator";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
});

async function uploadImages(imageFiles) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const res = await cloudinary.uploader.upload(dataURI);
    return res.url;
  });

  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}

router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and must be a number"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are required"),
  ],
  upload.array("imageFiles", 6),
  async (req, res) => {
    try {
      const imageFiles = req.files;
      const newHotel = req.body;

      const imageUrls = await uploadImages(imageFiles);

      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;

      const hotel = await Hotel.create(newHotel);

      res.status(201).send(hotel);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.get("/", verifyToken, async (req, res) => {
  try {
    const hotels = await Hotel.findAll({ where: { userId: req.userId } });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  try {
    const hotel = await Hotel.findOne({
      where: {
        hotelId: id,
        userId: req.userId,
      },
    });
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotel" });
  }
});

router.put(
  "/:hotelId",
  verifyToken,
  upload.array("imageFiles"),
  async (req, res) => {
    try {
      const hotelId = req.params.hotelId;
      const updatedHotel = req.body;

      if (!hotelId) {
        return res.status(400).json({ message: "Hotel ID is missing or undefined" });
      }

      updatedHotel.lastUpdated = new Date();

      const hotel = await Hotel.findOne({
        where: {
          hotelId: hotelId,
          userId: req.userId,
        },
      });

      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      const files = req.files;
      const updatedImageUrls = await uploadImages(files);
      const allImageUrls = [...updatedImageUrls, ...(hotel.imageUrls || [])];

      await hotel.update({
        ...updatedHotel,
        imageUrls: allImageUrls,
      });

      res.status(200).json(hotel);
    } catch (error) {
      console.error("Error updating hotel:", error);
      res.status(500).json({ message: "Something went wrong", error: error.message });
    }
  }
);

router.delete("/delete/:hotelId", verifyToken, async (req, res) => {
  const hotelId = req.params.hotelId;

  try {
    const hotel = await Hotel.findOne({
      where: {
        hotelId: hotelId,
        userId: req.userId,
      },
    });

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found or not authorized" });
    }

    await hotel.destroy();

    res.status(200).json({ message: "Hotel deleted successfully" });
  } catch (error) {
    console.error("Error deleting hotel:", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});

export default router;
