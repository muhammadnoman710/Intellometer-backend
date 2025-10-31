import { Router } from "express";
import { DiffuserController } from "../controllers/diffuser.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();
router.use(requireAuth);

// Create diffuser (expects zoneId in request body)
router.post("/", DiffuserController.create);

// List diffusers (optionally filter by ?zoneId=)
router.get("/", DiffuserController.list);

// Get diffuser details
router.get("/:diffuserId", DiffuserController.get);

// Update diffuser
router.put("/:diffuserId", DiffuserController.update);

// Move diffuser to another zone
router.post("/:diffuserId/move", DiffuserController.move);

// Delete diffuser
router.delete("/:diffuserId", DiffuserController.delete);

export default router;
