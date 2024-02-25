import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { HotelType } from "../shared/types";
import Hotel from "../models/Hotel";

export const createHotel = async (req: Request, res: Response) => {
  try {
    const imageFiles = req.files as Express.Multer.File[];
    const newHotel: HotelType = req.body;

    //upload images to cloudinary
    const uploadPromises = imageFiles.map(async (image) => {
      const b64 = Buffer.from(image.buffer).toString("base64");
      let dataURI = "data:" + image.mimetype + ";base64," + b64;
      const res = await cloudinary.uploader.upload(dataURI);
      return res.url;
    });

    const imageUrls = await Promise.all(uploadPromises);

    newHotel.imageUrls = imageUrls;
    newHotel.lastUpdated = new Date();
    newHotel.userId = req.userId;

    const hotel = new Hotel(newHotel);
    await hotel.save();

    res.status(201).json(hotel);
  } catch (error) {
    console.log("Error creating hotel: ", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};


export const getHotels = async (req: Request,res: Response) => {
  try {
    const hotels = await Hotel.find({userId: req.userId});

    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({message: "Error fetching hotels!"})
  }
}