import express from "express";
import {
  getNotifications,
  getOrderDetail,
  getOrders,
  placeOrder,
  readNotification,
} from "../controllers/customer.controller.js";
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
router.get("/orders/:orderId", protectRoute, getOrderDetail);
router.post("/orders", protectRoute, upload.single("image"), placeOrder);
router.get("/notifications", protectRoute, getNotifications);
router.patch("/notifications/:notificationId", protectRoute, readNotification);

export default router;
