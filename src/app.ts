import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import "./config/passport";

// Import route modules
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";
import zoneRoutes from "./routes/zone.routes";
import diffuserRoutes from "./routes/diffuser.routes";
import readingRoutes from "./routes/reading.routes";
import reportRoutes from "./routes/report.routes";

dotenv.config();

const app = express();

// ----------------------------
// Middleware setup
// ----------------------------
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(morgan("dev"));

// ----------------------------
// Routes
// ----------------------------
console.log("Mounting routers...");
app.use("/api/auth", authRoutes);
console.log("Mounted auth routes at /api/auth");
app.use("/api/projects", projectRoutes);
console.log("Mounted project routes at /api/projects");
app.use("/api", zoneRoutes);
console.log("Mounted zone routes at /api");
app.use("/api/diffusers", diffuserRoutes);
console.log("Mounted diffuser routes at /api/diffusers");
app.use("/api/readings", readingRoutes);
console.log("Mounted reading routes at /api/readings");
app.use("/api/reports", reportRoutes);
console.log("Mounted report routes at /api/reports");

// ----------------------------
// Health and root routes
// ----------------------------
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.get("/", (req, res) => {
  res.send("🚀 IntelloMeter Backend is running!");
});

// ----------------------------
// 404 Fallback
// ----------------------------
app.use((req, res) => {
  console.log("404 reached for:", req.method, req.originalUrl);
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
