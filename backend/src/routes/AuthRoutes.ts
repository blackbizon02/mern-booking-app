import express from "express";
import { authVerify, login, register, logout } from "../controllers/AuthController";
import { check } from "express-validator";
import verifyToken from "../middleware/auth";

const router = express.Router();

router.post(
  "/register",
  [
    check("firstName", "First name is required").isString(),
    check("lastName", "Last name is required").isString(),
    check("email", "Email is required").isEmail(),
    check(
      "password",
      "Password is required with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  register
);

router.post("/login", [
  check("email", "Email is required").isEmail(),
  check("password", "Password is required with 6 or more characters").isLength({
    min: 6,
  }),
], login);

router.get('/logout', logout);

router.get('/validate-token', verifyToken, authVerify);

export default router;
