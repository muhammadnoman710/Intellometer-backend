import { Request, Response } from "express";
import { ZoneService } from "../services/zone.service";

export const ZoneController = {
  async create(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const userId = req.user!.id;
      const zone = await ZoneService.create(userId, name);
      res.status(201).json(zone);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const zones = await ZoneService.getAll(userId);
      res.json(zones);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const zone = await ZoneService.getById(id!, userId);
      res.json(zone);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Zone ID is required" });
      }
      const result = await ZoneService.delete(id, userId);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
};
