import express from "express";
import {
  createField,
  deleteField,
  getFieldDetail,
  getFields,
  getOrders,
  getStatistics,
  preBook,
  updateField,
  updateOrderStatus,
} from "../controllers/owner.controller.js";
import protectRoute from "../middleware/protectRoute.js";

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../configs/cloudinaryConfig.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: "sport-arena" },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.get("/fields", protectRoute, getFields);
router.post("/fields", protectRoute, upload.single("image"), createField);
router.get("/fields/:fieldId", protectRoute, getFieldDetail);
router.patch(
  "/fields/:fieldId",
  protectRoute,
  upload.single("image"),
  updateField,
);
router.delete("/fields/:fieldId", protectRoute, deleteField);

router.get("/orders", protectRoute, getOrders);
router.patch("/orders/:orderId", protectRoute, updateOrderStatus);
router.post("/pre-bookings", protectRoute, preBook);

router.get("/statistics", protectRoute, getStatistics);

export default router;
