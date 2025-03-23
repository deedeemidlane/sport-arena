import express from "express";
import { getFieldDetail, getFields } from "../controllers/guest.controller.js";

const router = express.Router();

router.get("/fields", getFields);
router.get("/fields/:fieldId", getFieldDetail);

export default router;
