import app from "./app";
import "../src/types/express-augment";
import dotenv from "dotenv";
import prisma from "./config/db";
import redis from "./config/redis";

dotenv.config();

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    // Connect Prisma and Redis
    await prisma.$connect();
    console.log("✅ Prisma connected to DB");

    // await redis.connect();
    // console.log("✅ Redis connected successfully");

    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error during server startup:", err);
    process.exit(1);
  }

  // Graceful shutdown
  process.on("SIGINT", async () => {
    console.log("🛑 SIGINT received — shutting down gracefully...");
    await prisma.$disconnect();
    await redis.disconnect();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    console.log("🛑 SIGTERM received — shutting down gracefully...");
    await prisma.$disconnect();
    await redis.disconnect();
    process.exit(0);
  });
}

start();
