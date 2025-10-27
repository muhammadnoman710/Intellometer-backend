import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
// controllers/report.controller.ts would implement report generation

const router = Router();
router.use(requireAuth);

// Example endpoints (implement later)
router.post("/reports/sessions/:sessionId/docx", (req, res) => res.status(501).send({ error: "Not implemented" }));
router.post("/reports/sessions/:sessionId/pdf", (req, res) => res.status(501).send({ error: "Not implemented" }));

export default router;
