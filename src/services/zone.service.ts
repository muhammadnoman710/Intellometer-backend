import prisma from '../config/prisma';

export const ZoneService = {
  async create(projectId: string, userId: number, name: string) {
    // ensure project belongs to user
    const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
    if (!project) throw new Error("Project not found or unauthorized");
    return prisma.zone.create({ data: { projectId, name } });
  },

  async list(projectId: string, userId: number) {
    const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
    if (!project) throw new Error("Project not found or unauthorized");
    return prisma.zone.findMany({ where: { projectId }, include: { diffusers: true } });
  },

  async getById(zoneId: string, userId: number) {
    const zone = await prisma.zone.findUnique({ where: { id: zoneId }, include: { project: true, diffusers: true } });
    if (!zone) throw new Error("Zone not found");
    if (zone.project.userId !== userId) throw new Error("Unauthorized");
    return zone;
  },

  async update(zoneId: string, userId: number, data: any) {
    // ensure ownership
    const zone = await prisma.zone.findUnique({ where: { id: zoneId }, include: { project: true } });
    if (!zone || zone.project.userId !== userId) throw new Error("Unauthorized or zone not found");
    return prisma.zone.update({ where: { id: zoneId }, data });
  },

  async delete(zoneId: string, userId: number) {
    const zone = await prisma.zone.findUnique({ where: { id: zoneId }, include: { project: true } });
    if (!zone || zone.project.userId !== userId) throw new Error("Unauthorized or zone not found");
    return prisma.zone.delete({ where: { id: zoneId } });
  },
};
