import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/auth", authRoutes);

// health
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.get("/", (req, res) => {
  res.send("🚀 Backend is running!");
});


export default app;
