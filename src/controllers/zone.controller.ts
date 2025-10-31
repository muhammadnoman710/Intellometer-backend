import { Request, Response } from "express";
import { ZoneService } from "../services/zone.service";

export const ZoneController = {
  async create(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { name } = req.body;
      
      if (!req.params.projectId) {
        return res.status(400).json({ error: "projectId is required" });
      }
      
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: "Zone name is required" });
      }
      
      const zone = await ZoneService.create(req.params.projectId, userId, name.trim());
      res.status(201).json(zone);
    } catch (err: any) {
      console.error("Zone create error:", err);
      if (err.message.includes("not found") || err.message.includes("unauthorized")) {
        return res.status(404).json({ error: err.message });
      }
      res.status(500).json({ error: "Failed to create zone" });
    }
  },

  async list(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { projectId } = req.query;

      if (!projectId) {
        return res.status(400).json({ error: "projectId is required" });
      }

      // Fix: Correct parameter order - service expects (projectId, userId)
      const zones = await ZoneService.list(projectId as string, userId);
      return res.status(200).json(zones);
    } catch (err: any) {
      console.error("Zone list error:", err);
      if (err.message.includes("not found") || err.message.includes("unauthorized")) {
        return res.status(404).json({ error: err.message });
      }
      res.status(500).json({ error: "Failed to fetch zones" });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      if (!req.params.zoneId) {
        return res.status(400).json({ error: "zoneId is required" });
      }
      const zone = await ZoneService.getById(req.params.zoneId, userId);
      res.json(zone);
    } catch (err: any) {
      console.error("Zone getById error:", err);
      if (err.message.includes("not found")) {
        return res.status(404).json({ error: err.message });
      }
      if (err.message.includes("Unauthorized")) {
        return res.status(403).json({ error: err.message });
      }
      res.status(500).json({ error: "Failed to fetch zone" });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      if (!req.params.zoneId) {
        return res.status(400).json({ error: "zoneId is required" });
      }
      const zone = await ZoneService.update(req.params.zoneId, userId, req.body);
      res.json(zone);
    } catch (err: any) {
      console.error("Zone update error:", err);
      if (err.message.includes("not found")) {
        return res.status(404).json({ error: err.message });
      }
      if (err.message.includes("Unauthorized")) {
        return res.status(403).json({ error: err.message });
      }
      res.status(500).json({ error: "Failed to update zone" });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      if (!req.params.zoneId) {
        return res.status(400).json({ error: "zoneId is required" });
      }
      await ZoneService.delete(req.params.zoneId, userId);
      res.json({ message: "Zone deleted successfully" });
    } catch (err: any) {
      console.error("Zone delete error:", err);
      if (err.message.includes("not found")) {
        return res.status(404).json({ error: err.message });
      }
      if (err.message.includes("Unauthorized")) {
        return res.status(403).json({ error: err.message });
      }
      res.status(500).json({ error: "Failed to delete zone" });
    }
  }
};
