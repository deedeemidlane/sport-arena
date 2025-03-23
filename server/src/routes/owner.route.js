import express from "express";
import {
  createField,
  getFieldDetail,
  getFields,
  updateField,
} from "../controllers/owner.controller.js";
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

router.get("/fields", protectRoute, getFields);
router.post("/fields", protectRoute, upload.single("image"), createField);
router.get("/fields/:fieldId", protectRoute, getFieldDetail);
router.patch(
  "/fields/:fieldId",
  protectRoute,
  upload.single("image"),
  updateField,
);

export default router;
