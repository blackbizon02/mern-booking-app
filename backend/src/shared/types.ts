import { Document } from "mongoose";

export interface UserType extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  createJWT: () => string;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

export interface HotelType extends Document {
  _id: string;
  userId: string;
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  adultCount: number;
  childCount: number;
  facilities: string[];
  pricePerNight: number;
  starRating: Number;
  imageUrls: string[];
  lastUpdated: Date;
}