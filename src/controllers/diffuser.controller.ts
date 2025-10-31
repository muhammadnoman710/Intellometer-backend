import { Request, Response } from "express";
import { DiffuserService } from "../services/diffuser.service";

export const DiffuserController = {
  async create(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { zoneId, label, size_input, size_unit, deviceIdentifier } = req.body;
      if (!zoneId || typeof zoneId !== "string") {
        return res.status(400).json({ error: "zoneId is required" });
      }
      const diffuser = await DiffuserService.create(zoneId, userId, label, size_input, size_unit, deviceIdentifier);
      res.status(201).json(diffuser);
    } catch (err: any) {
      console.error("Diffuser create error:", err);
      if (err.message.includes("unauthorized") || err.message.includes("not found")) {
        return res.status(404).json({ error: err.message });
      }
      res.status(500).json({ error: "Failed to create diffuser" });
    }
  },

  async list(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { zoneId } = req.query as { zoneId?: string };
      if (zoneId) {
        const diffusers = await DiffuserService.list(zoneId, userId);
        return res.json(diffusers);
      }
      // List all diffusers owned by the user when no zoneId is provided
      const all = await DiffuserService.listAllForUser(userId);
      const ordered = all.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      const diffusers = ordered;
      res.json(diffusers);
    } catch (err: any) {
      console.error("Diffuser list error:", err);
      res.status(500).json({ error: "Failed to fetch diffusers" });
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
