import express from "express";
import {
  acceptMatchRequest,
  confirmDeposit,
  createMatchRequest,
  deposit,
  getMyMatchRequests,
  getNotifications,
  getOrderDetail,
  getOrders,
  getOtherMatchRequests,
  getSendedMatchRequests,
  placeOrder,
  readNotification,
  requestMatch,
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
router.post("/match-requests", protectRoute, createMatchRequest);
router.get("/my-match-requests", protectRoute, getMyMatchRequests);
router.get("/other-match-requests", protectRoute, getOtherMatchRequests);
router.get("/sended-match-requests", protectRoute, getSendedMatchRequests);
router.post("/request-match", protectRoute, requestMatch);
router.post("/accept-match-request", protectRoute, acceptMatchRequest);
router.post("/deposit", protectRoute, upload.single("image"), deposit);
router.post("/confirm-deposit", protectRoute, confirmDeposit);

export default router;
