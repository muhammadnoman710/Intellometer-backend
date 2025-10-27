import { Router } from "express";
import { DiffuserController } from "../controllers/diffuser.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();
router.use(requireAuth);

router.post("/zones/:zoneId/diffusers", DiffuserController.create);
router.get("/zones/:zoneId/diffusers", DiffuserController.list);
router.get("/diffusers/:diffuserId", DiffuserController.get);
router.put("/diffusers/:diffuserId", DiffuserController.update);
router.post("/diffusers/:diffuserId/move", DiffuserController.move);
router.delete("/diffusers/:diffuserId", DiffuserController.delete);

export default router;
