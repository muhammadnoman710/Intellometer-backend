import { Router } from "express";
import { ProjectController } from "../controllers/project.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();
router.use(requireAuth);

router.post("/", ProjectController.create);
router.get("/", ProjectController.list);
router.get("/:projectId", ProjectController.getById);
router.put("/:projectId", ProjectController.update);
router.delete("/:projectId", ProjectController.delete);

export default router;
