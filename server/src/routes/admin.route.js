import express from "express";
import { getUsers } from "../controllers/admin.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/users", protectRoute, getUsers);

export default router;
