import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";
import ownerRoutes from "./routes/owner.route.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3001;

app.use(cookieParser()); // for parsing cookie
app.use(express.json()); // for parsing application/json

app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/owner", ownerRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Sport Arena API" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
