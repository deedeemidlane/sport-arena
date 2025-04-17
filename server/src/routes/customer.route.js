import express from "express";
import {
  acceptMatchRequest,
  cancelOrder,
  confirmDeposit,
  confirmRefund,
  createMatchRequest,
  createReview,
  deposit,
  getCreatedMatchRequests,
  getNotifications,
  getOrderDetail,
  getOrders,
  getOtherMatchRequests,
  getSendedMatchRequests,
  placeOrder,
  readNotification,
  rejectMatchRequest,
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
router.post("/cancel-order", protectRoute, cancelOrder);
router.post("/confirm-refund", protectRoute, confirmRefund);

router.get("/notifications", protectRoute, getNotifications);
router.patch("/notifications/:notificationId", protectRoute, readNotification);

router.post("/match-requests", protectRoute, createMatchRequest);
router.get("/created-match-requests", protectRoute, getCreatedMatchRequests);
router.get("/other-match-requests", protectRoute, getOtherMatchRequests);
router.get("/sended-match-requests", protectRoute, getSendedMatchRequests);
router.post("/request-match", protectRoute, requestMatch);
router.post("/accept-match-request", protectRoute, acceptMatchRequest);
router.post("/reject-match-request", protectRoute, rejectMatchRequest);
router.post("/deposit", protectRoute, upload.single("image"), deposit);
router.post("/confirm-deposit", protectRoute, confirmDeposit);

router.post("/reviews", protectRoute, createReview);

export default router;
