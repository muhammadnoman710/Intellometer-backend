import { Request, Response } from "express";
import { SessionService } from "../services/session.service";

export const SessionController = {
  async create(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      if (!req.params.zoneId) {
        return res.status(400).json({ error: "zoneId is required" });
      }
      const session = await SessionService.create(req.params.zoneId, userId, req.body);
      res.status(201).json(session);
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
      const sessions = await SessionService.list(req.params.zoneId, userId);
      res.json(sessions);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async get(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      if (!req.params.sessionId) {
        return res.status(400).json({ error: "sessionId is required" });
      }
      const session = await SessionService.getById(req.params.sessionId, userId);
      res.json(session);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  },

  async finish(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      if (!req.params.sessionId) {
        return res.status(400).json({ error: "sessionId is required" });
      }
      const session = await SessionService.finish(req.params.sessionId, userId);
      res.json(session);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
};
