import express from "express";
import {
  createOwnerAccount,
  getUser,
  login,
  logout,
} from "../controllers/auth.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/create-owner-account", createOwnerAccount);
router.get("/user", protectRoute, getUser);
router.post("/login", login);
router.post("/logout", logout);

export default router;
