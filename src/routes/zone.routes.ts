// src/routes/zone.routes.ts
import { Router } from "express";
import { ZoneController } from "../controllers/zone.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", requireAuth, ZoneController.create);
router.get("/", requireAuth, ZoneController.getAll);
router.get("/:id", requireAuth, ZoneController.getById);
router.delete("/:id", requireAuth, ZoneController.delete);

export default router;
