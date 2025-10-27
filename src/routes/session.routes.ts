import { Router } from "express";
import { SessionController } from "../controllers/session.controller";
import * as ReadingController from "../controllers/reading.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();
router.use(requireAuth);

// Sessions
router.post("/zones/:zoneId/sessions", SessionController.create);
router.get("/zones/:zoneId/sessions", SessionController.list);
router.get("/sessions/:sessionId", SessionController.get);
router.post("/sessions/:sessionId/finish", SessionController.finish);

// Readings
router.post("/sessions/:sessionId/readings/:diffuserId", ReadingController.createReading);
router.get("/sessions/:sessionId/readings", ReadingController.getForSession);
router.get("/diffusers/:diffuserId/readings", ReadingController.getReadingsByDiffuser);

export default router;
