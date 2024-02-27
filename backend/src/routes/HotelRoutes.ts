import express from "express";
import { getHotel, searchHotels } from "../controllers/HotelSearch";
import { param } from "express-validator";

const router = express.Router();

router.get("/search", searchHotels);
router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Hotel Id is required!")],
  getHotel
);

export default router;
