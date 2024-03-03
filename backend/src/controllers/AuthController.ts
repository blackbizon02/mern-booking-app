import { Request, Response } from "express";
import User from "../models/User";
import attachCookie from "../utils/attachCookie";
import { validationResult } from "express-validator";

const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  try {
    let emailAlreadyExists = await User.findOne({
      email: req.body.email,
    });

    if (emailAlreadyExists) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const user = User.create(req.body);

    const token = (await user).createJWT();

    attachCookie({ res, token });
    res.status(201).json({ message: "User Registered!" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Something went wrong!" });
  }
};

const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    const token = user.createJWT();

    attachCookie({ res, token });
    return res.status(200).json({ userId: user._id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

const authVerify = (req: Request, res: Response) => {
  res.status(200).json({ userId: req.userId });
};

const logout = async (req: Request, res: Response) => {
  res.cookie("auth_token", "", {
    expires: new Date(Date.now()),
  });
  res.status(200).json({ message: "User logged out!" });
};

const getUser = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("🚀 ~ getUser ~ error:", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export { register, login, authVerify, logout, getUser };
