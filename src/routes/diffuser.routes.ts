// src/routes/diffuser.routes.ts
import { Router } from "express";
import { DiffuserController } from "../controllers/diffuser.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/:zoneId/diffusers", requireAuth, DiffuserController.create);
router.get("/:zoneId/diffusers", requireAuth, DiffuserController.getAll);
router.get("/diffusers/:id", requireAuth, DiffuserController.getById);
router.put("/diffusers/:id", requireAuth, DiffuserController.update);
router.delete("/diffusers/:id", requireAuth, DiffuserController.delete);

export default router;
