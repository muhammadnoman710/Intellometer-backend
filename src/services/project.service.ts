import prisma from '../config/prisma';

export const ProjectService = {
  async create(userId: number, name: string, ahuInfo?: any) {
    return prisma.project.create({
      data: { userId, name, ahuInfo },
    });
  },

  async list(userId: number) {
    return prisma.project.findMany({
      where: { userId },
      include: { zones: { include: { diffusers: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(userId: number, id: string) {
    return prisma.project.findFirst({
      where: { id, userId },
      include: { zones: { include: { diffusers: true } }, sessions: true },
    });
  },

  async update(userId: number, id: string, data: any) {
    return prisma.project.updateMany({          
      where: { id, userId },
      data,
    });
  },

  async delete(userId: number, id: string) {
    return prisma.project.deleteMany({ where: { id, userId } });
  },
};
