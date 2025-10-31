import { Router } from "express";
import { ZoneController } from "../controllers/zone.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();
router.use(requireAuth);

router.post("/projects/:projectId/zones", ZoneController.create);
router.get("/zones", ZoneController.list);
router.get("/zones/:zoneId", ZoneController.getById);
router.put("/zones/:zoneId", ZoneController.update);
router.delete("/zones/:zoneId", ZoneController.delete);

export default router;
