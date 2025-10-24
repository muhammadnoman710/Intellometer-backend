// src/services/diffuser.service.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const DiffuserService = {
  async create(zoneId: string) {
    // Check limit
    const count = await prisma.diffuser.count({ where: { zoneId } });
    if (count >= 15) throw new Error("Max 15 diffusers allowed per zone.");

    // Find next available diffuser number
    const existingNames = await prisma.diffuser.findMany({
      where: { zoneId },
      select: { name: true },
    });

    const numbers = existingNames
      .map(d => parseInt(d.name.replace("Diffuser ", ""), 10))
      .filter(n => !isNaN(n))
      .sort((a, b) => a - b);

    let nextNumber = 1;
    for (let i = 1; i <= 15; i++) {
      if (!numbers.includes(i)) {
        nextNumber = i;
        break;
      }
    }

    const name = `Diffuser ${nextNumber}`;
    return prisma.diffuser.create({ data: { zoneId, name } });
  },

  async getAll(zoneId: string) {
    return prisma.diffuser.findMany({
      where: { zoneId },
      orderBy: { createdAt: "asc" },
    });
  },

  async getById(id: string) {
    const diffuser = await prisma.diffuser.findUnique({ where: { id } });
    if (!diffuser) throw new Error("Diffuser not found.");
    return diffuser;
  },

  async update(id: string, data: any) {
    const diffuser = await prisma.diffuser.update({
      where: { id },
      data,
    });
    return diffuser;
  },

  async delete(id: string) {
    await prisma.diffuser.delete({ where: { id } });
    return { message: "Diffuser deleted successfully" };
  },
};
