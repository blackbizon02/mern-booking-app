import express from "express";
import { createHotel, getHotels } from "../controllers/HotelsController";
import multer from "multer";
import auth from "../middleware/auth";
import { body } from "express-validator";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, //5mb
});

router.post("/", [
  body("name").notEmpty().withMessage('Name is required!'),
  body("city").notEmpty().withMessage("City is required!"),
  body("country").notEmpty().withMessage("Country is required!"),
  body("description").notEmpty().withMessage("Description is required!"),
  body("type").notEmpty().withMessage("Type is required!"),
  body("pricePerNight").notEmpty().isNumeric().withMessage("Price Per Night is required and must be a number!"),
  body("facilities").notEmpty().isArray().withMessage("Facilities is required!"),
], auth, upload.array("imageFiles", 6), createHotel);

router.get("/", auth, getHotels);

export default router;