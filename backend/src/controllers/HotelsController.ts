import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { HotelType } from "../shared/types";
import Hotel from "../models/Hotel";

export const createHotel = async (req: Request, res: Response) => {
  try {
    const imageFiles = req.files as Express.Multer.File[];
    const newHotel: HotelType = req.body;

    //upload images to cloudinary
    const imageUrls = await uploadImages(imageFiles);

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

export const getHotels = async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });

    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels!" });
  }
};

export const editHotel = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const hotel = await Hotel.findOne({ _id: id });
    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotel!" });
  }
};

export const updateHotel = async (req: Request, res: Response) => {
  try {
    const updatedHotel: HotelType = req.body;
    updatedHotel.lastUpdated = new Date();

    console.log(req.userId);

    const hotel = await Hotel.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updatedHotel,
      { new: true }
    );

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found!" });
    }

    const files = req.files as Express.Multer.File[];

    const updatedImageUrls = await uploadImages(files);

    hotel.imageUrls = [...updatedImageUrls, ...(updatedHotel.imageUrls || [])];

    await hotel.save();

    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};

async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const res = await cloudinary.uploader.upload(dataURI);
    return res.url;
  });

  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}
