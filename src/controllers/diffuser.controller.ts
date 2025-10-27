import { Request, Response } from "express";
import { DiffuserService } from "../services/diffuser.service";

export const DiffuserController = {
  async create(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { label, size_input, size_unit, deviceIdentifier } = req.body;
      if (!req.params.zoneId) {
        return res.status(400).json({ error: "zoneId is required" });
      }
      const diffuser = await DiffuserService.create(req.params.zoneId, userId, label, size_input, size_unit, deviceIdentifier);
      res.status(201).json(diffuser);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async list(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      if (!req.params.zoneId) {
        return res.status(400).json({ error: "zoneId is required" });
      }
      const diffusers = await DiffuserService.list(req.params.zoneId, userId);
      res.json(diffusers);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async get(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      if (!req.params.diffuserId) {
        return res.status(400).json({ error: "diffuserId is required" });
      }
      const diffuser = await DiffuserService.getById(req.params.diffuserId, userId);
      res.json(diffuser);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      if (!req.params.diffuserId) {
        return res.status(400).json({ error: "diffuserId is required" });
      }
      const diffuser = await DiffuserService.update(req.params.diffuserId, userId, req.body);
      res.json(diffuser);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async move(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { toZoneId, note } = req.body;
      if (!req.params.diffuserId) {
        return res.status(400).json({ error: "diffuserId is required" });
      }
      const updated = await DiffuserService.move(req.params.diffuserId, userId, toZoneId, note);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      if (!req.params.diffuserId) {
        return res.status(400).json({ error: "diffuserId is required" });
      }
      await DiffuserService.delete(req.params.diffuserId, userId);
      res.json({ message: "Deleted" });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
};
