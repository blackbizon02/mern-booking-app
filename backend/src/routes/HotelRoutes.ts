import express from "express";
import {
  getHotel,
  postBooking,
  searchHotels,
  stripePaymentIntent,
} from "../controllers/HotelSearch";
import { param } from "express-validator";
import verifyToken from "../middleware/auth";

const router = express.Router();

router.get("/search", searchHotels);
router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Hotel Id is required!")],
  getHotel
);

router.post(
  "/:hotelId/bookings/payment-intent",
  verifyToken,
  stripePaymentIntent
);

router.post("/:hotelId/bookings", verifyToken, postBooking);

export default router;
