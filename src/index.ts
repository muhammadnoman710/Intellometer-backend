import app from "./app";
import dotenv from "dotenv";
import prisma from "./config/db";
import redis from "./config/redis";

dotenv.config();
const PORT = process.env.PORT || 5000;

async function start() {
  try {
    // test DB and Redis connections
    await prisma.$connect();
    console.log("✅ Prisma connected to DB");
  } catch (err) {
    console.error("Prisma connection error:", err);
  }

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });

  // cleanup handlers (optional)
  process.on("SIGINT", async () => {
    console.log("SIGINT received — shutting down");
    await prisma.$disconnect();
    redis.disconnect();
    process.exit(0);
  });
}

start();
