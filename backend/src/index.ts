import express, { urlencoded, Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

//routes
import userAuthRoutes from "./routes/AuthRoutes";
import hotelRoutes from "./routes/My-Hotels";

import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

//cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//database connect
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

const app = express();
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/api/auth", userAuthRoutes);
app.use("/api/my-hotels", hotelRoutes);

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server is running on localhost: ${PORT}...`);
});
