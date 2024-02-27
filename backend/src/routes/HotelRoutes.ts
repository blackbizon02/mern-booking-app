import express from "express";
import auth from "../middleware/auth";
import { searchHotels } from "../controllers/HotelSearch";

const router = express.Router();

router.get("/search", searchHotels);

export default router;