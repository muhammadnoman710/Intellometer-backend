import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { ReportController } from "../controllers/report.controller";

const router = Router();

// ✅ Apply auth middleware to all routes
router.use(requireAuth);

// ✅ Project-level reports
router.post("/project/:projectId/preview", ReportController.previewProjectReport);
router.post("/project/:projectId/doc", ReportController.generateProjectDocReport);

// ✅ Session-level reports
router.post("/sessions/:sessionId/pdf", ReportController.generateSessionPdfReport);
router.post("/sessions/:sessionId/docx", ReportController.generateSessionDocxReport);

export default router;
