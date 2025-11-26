import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Generate JWT token
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: '30d', // Token expires in 30 days
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password, // Password will be hashed in the model pre-save hook
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
          token: generateToken(user._id.toString()),
        },
      });
    } else {
      res.status(400).json({ success: false, error: 'Invalid user data' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password is correct
    if (user && (await user.comparePassword(password))) {
      res.json({
        success: true,
        data: {
          user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
          token: generateToken(user._id.toString()),
        },
      });
    } else {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (user) {
      res.json({
        success: true,
        data: {
          user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
        },
      });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
