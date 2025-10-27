import { Request, Response } from "express";
import { ReadingService } from "../services/reading.service";

// Create a new reading
export const createReading = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { diffuserId } = req.body;
    
    if (!diffuserId) {
      return res.status(400).json({ error: "diffuserId is required" });
    }

    // For now, we'll need a sessionId - this might need to be passed in the body or derived
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required" });
    }

    const reading = await ReadingService.save(sessionId, diffuserId, userId, req.body);
    res.status(201).json({ success: true, reading });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Update an existing reading
export const updateReading = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { readingId } = req.params;
    
    if (!readingId) {
      return res.status(400).json({ error: "readingId is required" });
    }

    // First verify the reading exists and belongs to the user
    const existingReading = await ReadingService.getById(readingId, userId);
    if (!existingReading) {
      return res.status(404).json({ error: "Reading not found" });
    }

    const updatedReading = await ReadingService.update(readingId, userId, req.body);
    res.json({ success: true, reading: updatedReading });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Get readings by diffuser
export const getReadingsByDiffuser = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { diffuserId } = req.query;
    
    if (!diffuserId || typeof diffuserId !== 'string') {
      return res.status(400).json({ error: "diffuserId query parameter is required" });
    }

    const readings = await ReadingService.getByDiffuser(diffuserId, userId);
    res.json({ success: true, readings });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Get readings by date
export const getReadingsByDate = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { date } = req.query;
    
    if (!date || typeof date !== 'string') {
      return res.status(400).json({ error: "date query parameter is required (YYYY-MM-DD format)" });
    }

    const readings = await ReadingService.getByDate(date, userId);
    res.json({ success: true, readings });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Get readings by zone
export const getReadingsByZone = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { zoneId } = req.params;
    
    if (!zoneId) {
      return res.status(400).json({ error: "zoneId is required" });
    }

    const readings = await ReadingService.getByZone(zoneId, userId);
    res.json({ success: true, readings });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Legacy function for session-based reading retrieval
export const getForSession = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { sessionId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required" });
    }
    
    const data = await ReadingService.getForSession(sessionId, userId);
    res.json({ success: true, readings: data });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};
