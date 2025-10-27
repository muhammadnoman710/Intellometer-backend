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
      const zone = await ZoneService.create(req.params.projectId, userId, name);
      res.status(201).json(zone);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async list(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      if (!req.params.projectId) {
        return res.status(400).json({ error: "projectId is required" });
      }
      const zones = await ZoneService.list(req.params.projectId, userId);
      res.json(zones);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
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
      res.status(404).json({ error: err.message });
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
      res.status(400).json({ error: err.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      if (!req.params.zoneId) {
        return res.status(400).json({ error: "zoneId is required" });
      }
      const zone = await ZoneService.delete(req.params.zoneId, userId);
      res.json({ message: "Zone deleted" });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
};
