import express from "express";
import {
  createCustomerAccount,
  createOwnerAccount,
  getUser,
  login,
  verifyEmail,
} from "../controllers/auth.controller.js";
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

router.post("/create-owner-account", createOwnerAccount);
router.post(
  "/create-customer-account",
  upload.fields([
    { name: "frontIdCardImage", maxCount: 1 },
    { name: "backIdCardImage", maxCount: 1 },
  ]),
  createCustomerAccount,
);
router.post("/verify-account", verifyEmail);
router.get("/user", protectRoute, getUser);
router.post("/login", login);

export default router;
