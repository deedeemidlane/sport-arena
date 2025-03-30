import express from "express";
import { getOrders, placeOrder } from "../controllers/customer.controller.js";
import protectRoute from "../middleware/protectRoute.js";

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../configs/cloudinaryConfig.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "sport-arena",
    // allowed_formats: ["jpeg", "png", "jpg"],
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.get("/orders", protectRoute, getOrders);
router.post("/orders", protectRoute, upload.single("image"), placeOrder);

export default router;
