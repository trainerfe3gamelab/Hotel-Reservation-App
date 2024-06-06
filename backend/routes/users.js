import express from 'express';
import User from '../models/user.js'; // Ensure this is the path to your Sequelize User model
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';

const router = express.Router();

// /api/users/register
router.post(
  '/register',
  [
    check('fullName', 'Full Name is required').isString(),
    check('email', 'Email is required').isEmail(),
    check('password', 'Password with 6 or more characters required').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findOne({
        where: {
          email: req.body.email,
        },
      });

      if (user) {
        return res.status(400).json({
          message: 'User already exists',
        });
      }

      user = await User.create(req.body);

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY,
        { 
          expiresIn: '1d',
        }
      );

      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 86400000,
      });
      return res.status(200).send({ message: 'User created successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
);

export default router;
