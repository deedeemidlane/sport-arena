import express from "express";
import {
  createField,
  getFieldDetail,
  getFields,
  updateField,
} from "../controllers/owner.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/fields", protectRoute, getFields);
router.post("/fields", protectRoute, createField);
router.get("/fields/:fieldId", protectRoute, getFieldDetail);
router.patch("/fields/:fieldId", protectRoute, updateField);

export default router;
