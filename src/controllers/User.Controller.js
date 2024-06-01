import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.Model.js";
import { generateToken } from "../config/generateToken.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";

// Set common cookie options
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Only set to true in production
  sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax', // Use Lax in development
  path: '/', // Ensure the cookie is accessible across the entire site
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

// signUp user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ([name, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new ApiError(400, "User already exists!");
  }

  const photoLocalPath = req.file?.path;

  if (!photoLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const photo = await uploadonCloudinary(photoLocalPath);

  const user = await User.create({
    name,
    email,
    password,
    photo: photo.url
  });

  if (!user) {
    throw new ApiError(500, "User not created");
  }

  const token = generateToken(user._id);

  res.cookie('token', token, getCookieOptions());

  return res.status(201).json({
    statusCode: 200,
    data: {
      user,
      token
    },
    message: "User signup completed!!",
    success: true
  });
});

// LogIn
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(500, "User not found");
  }

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);

    res.cookie('token', token, getCookieOptions());

    res.json({
      statusCode: 200,
      data: {
        user,
        token
      },
      message: "User login completed!!",
      success: true
    });
  } else {
    throw new ApiError(401, "Invalid email or password");
  }
});

const allUsers = asyncHandler(async(req, res) => {
  const keyword = req.query.search ? {
    $or: [{
      name: { $regex: req.query.search, $options: "i" }
    }, {
      email: { $regex: req.query.search, $options: "i" }
    }]
  } : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

export { registerUser, loginUser, allUsers };
