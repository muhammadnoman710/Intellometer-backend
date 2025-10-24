// src/controllers/diffuser.controller.ts
import { Request, Response } from "express";
import { DiffuserService } from "../services/diffuser.service";

export const DiffuserController = {
  async create(req: Request, res: Response) {
    try {
      const { zoneId } = req.params;
      if (!zoneId) {
        return res.status(400).json({ error: "zoneId is required" });
      }
      const diffuser = await DiffuserService.create(zoneId);
      res.status(201).json(diffuser);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const { zoneId } = req.params;
      if (!zoneId) {
        return res.status(400).json({ error: "zoneId is required" });
      }
      const diffusers = await DiffuserService.getAll(zoneId);
      res.json(diffusers);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "id is required" });
      }
      const diffuser = await DiffuserService.getById(id);
      res.json(diffuser);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "id is required" });
      }
      const diffuser = await DiffuserService.update(id, req.body);
      res.json(diffuser);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "id is required" });
      }
      const result = await DiffuserService.delete(id);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
};
