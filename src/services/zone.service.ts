import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const ZoneService = {
  async create(userId: number, name: string) {
    const existing = await prisma.zone.findFirst({
      where: { userId, name },
    });
    if (existing) throw new Error("Zone with this name already exists.");

    return prisma.zone.create({
      data: {
        userId,
        name,
      },
    });
  },

  async getAll(userId: number) {
    return prisma.zone.findMany({
      where: { userId },
      include: { diffusers: true },
      orderBy: { createdAt: "asc" },
    });
  },

  async getById(id: string, userId: number) {
    const zone = await prisma.zone.findFirst({
      where: { id, userId },
      include: { diffusers: true },
    });
    if (!zone) throw new Error("Zone not found or not yours.");
    return zone;
  },

  async delete(id: string, userId: number) {
    const zone = await prisma.zone.findFirst({
      where: { id, userId },
    });
    if (!zone) throw new Error("Zone not found or not yours.");

    await prisma.zone.delete({ where: { id } });
    return { message: "Zone deleted successfully" };
  },
};
