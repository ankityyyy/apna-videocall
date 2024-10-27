import httpStatus from "http-status";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Meeting } from "../models/metting.js";

export const register = async (req, res) => {
  try {
    const { userName, name, password } = req.body;

    // Check for missing fields
    if (!userName || !name || !password) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "All Fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res
        .status(httpStatus.CONFLICT)
        .json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = new User({
      name: name,
      userName: userName, // Make sure this matches your model's field name
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success message
    res.status(httpStatus.CREATED).json({ message: "User Registered" });
  } catch (err) {
    // Catch any errors and send a response
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: `Something went wrong: ${err.message}` });
  }
};

export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "All Fields are required" });
    }

    const foundUser = await User.findOne({ userName });

    // Check if user exists
    if (!foundUser) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User does not exist" });
    }

    // Use foundUser.password instead of User.password
    let isPasswordCorrect = await bcrypt.compare(password, foundUser.password);

    if (isPasswordCorrect) {
      let token = crypto.randomBytes(20).toString("hex");

      foundUser.token = token;
      await foundUser.save();
      return res.status(httpStatus.OK).json({ token: token });
    } else {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid Username or password" });
    }

    // if (!isPasswordCorrect) {
    //   return res
    //     .status(httpStatus.BAD_REQUEST)
    //     .json({ message: "Invalid credentials" });
    // }

    // // Generate a random token
    // let token = crypto.randomBytes(20).toString("hex");

    // // Save the token to the user record
    // foundUser.token = token;
    // await foundUser.save();

    // // Send the token back to the client
    // return res.status(httpStatus.OK).json({ token });
  } catch (err) {
    // Catch any errors and send a response
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: `Something went wrong: ${err.message}` });
  }
};

export const getUserHistory = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token: token });
    const meetings = await Meeting.find({ user_id: user.username });
    res.json(meetings);
  } catch (e) {
    res.json({ message: `Something went wrong ${e}` });
  }
};

export const addToHistory = async (req, res) => {
  const { token, meeting_code } = req.body;

  try {
    const user = await User.findOne({ token: token });

    const newMeeting = new Meeting({
      user_id: user.username,
      meetingCode: meeting_code,
    });

    await newMeeting.save();

    res.status(httpStatus.CREATED).json({ message: "Added code to history" });
  } catch (e) {
    res.json({ message: `Something went wrong ${e}` });
  }
};
