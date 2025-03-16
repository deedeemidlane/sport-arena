import express from "express";
import {
  createCustomerAccount,
  createOwnerAccount,
  getUser,
  login,
  verifyEmail,
} from "../controllers/auth.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/create-owner-account", createOwnerAccount);
router.post("/create-customer-account", createCustomerAccount);
router.post("/verify-account", verifyEmail);
router.get("/user", protectRoute, getUser);
router.post("/login", login);

export default router;
