import express from "express";
import { deleteUser, getUsers } from "../controllers/admin.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/users", protectRoute, getUsers);
router.delete("/users/:userId", protectRoute, deleteUser);

export default router;
