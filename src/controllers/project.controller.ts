import { Request, Response } from "express";
import { ProjectService } from "../services/project.service";

export const ProjectController = {
  async create(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { name, ahuInfo } = req.body;
      // Validate project name
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ error: "Project name is required" });
      }
      const projectName = name.trim();
      const project = await ProjectService.create(userId, projectName, ahuInfo ?? undefined);
      res.status(201).json(project);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async list(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const projects = await ProjectService.list(userId);
      res.json(projects);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const projectId = req.params.projectId;
      if (!projectId) {
        return res.status(400).json({ error: "projectId is required" });
      }
      const project = await ProjectService.getById(userId, projectId);
      res.json(project);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const projectId = req.params.projectId;
      if (!projectId) {
        return res.status(400).json({ error: "projectId is required" });
      }
      await ProjectService.update(userId, projectId, req.body);
      res.json({ message: "Updated" });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const projectId = req.params.projectId;
      if (!projectId) {
        return res.status(400).json({ error: "projectId is required" });
      }
      await ProjectService.delete(userId, projectId);
      res.json({ message: "Deleted" });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
};
