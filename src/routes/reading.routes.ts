import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import * as ReadingController from "../controllers/reading.controller";

const router = Router();

/**
 * @route   POST /api/readings
 * @desc    Add a new reading for a diffuser
 * @access  Private
 */
router.post("/", requireAuth, ReadingController.createReading);

/**
 * @route   PUT /api/readings/:readingId
 * @desc    Update an existing reading
 * @access  Private
 */
router.put("/:readingId", requireAuth, ReadingController.updateReading);

/**
 * @route   GET /api/readings
 * @desc    Get all readings for a diffuser
 * @query   diffuserId=<ID>
 * @access  Private
 */
router.get("/", requireAuth, ReadingController.getReadingsByDiffuser);

/**
 * @route   GET /api/readings/history
 * @desc    Get readings filtered by date (for History screen)
 * @query   date=YYYY-MM-DD
 * @access  Private
 */
router.get("/history", requireAuth, ReadingController.getReadingsByDate);

/**
 * @route   GET /api/readings/zone/:zoneId
 * @desc    Get all readings for a specific zone (for report generation)
 * @access  Private
 */
router.get("/zone/:zoneId", requireAuth, ReadingController.getReadingsByZone);

export default router;
