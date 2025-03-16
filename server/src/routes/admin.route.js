import express from "express";
import { getAccounts } from "../controllers/admin.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/accounts", protectRoute, getAccounts);

export default router;
