import express from "express";
import { body, validationResult } from "express-validator";
import User from "../models/user.js"; 
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
});

router.put(
  "/me",
  verifyToken,
  [
    body("fullName").notEmpty().withMessage("Fullname is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("role").notEmpty().withMessage("Role is required"),
    body("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("confirmPassword")
      .optional()
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Passwords do not match"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const userId = req.userId; 
      const updatedData = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.fullName = updatedData.fullName || user.fullName;
      user.email = updatedData.email || user.email;
      user.role = updatedData.role || user.role;

      if (updatedData.password) {
        user.password = updatedData.password; 
      }

      await user.save();

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error updating profile", error: error.message });
    }
  }
);

export default router;
