import express, { Request, Response } from "express";
const router = express.Router();
import verifyToken from "../middleware/auth";
import Hotel from "../models/Hotel";
import { HotelType } from "../shared/types";

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({
      bookings: { $elemMatch: { userId: req.userId } },
    });

    const result = hotels.map((hotel) => {
      const userBookings = hotel.bookings.filter(
        (booking) => booking.userId === req.userId
      );

      const hotelWithUserBookings: HotelType = {
        ...hotel.toObject(),
        bookings: userBookings,
      };

      return hotelWithUserBookings;
    });

    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch bookings!" });
  }
});

export default router;
