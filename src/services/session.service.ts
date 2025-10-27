import prisma from '../config/prisma';

export const SessionService = {
  async create(zoneId: string, userId: number, payload: any) {
    // ensure zone ownership/project
    const zone = await prisma.zone.findUnique({ where: { id: zoneId }, include: { project: true } });
    if (!zone || zone.project.userId !== userId) throw new Error("Zone not found or unauthorized");

    const session = await prisma.session.create({
      data: {
        projectId: zone.projectId,
        zoneId,
        userId,
        sessionName: payload.sessionName,
        AHUInfo: payload.AHUInfo ?? zone.project.ahuInfo ?? {},
        notes: payload.notes,
      }
    });

    return session;
  },

  async list(zoneId: string, userId: number) {
    const zone = await prisma.zone.findUnique({ where: { id: zoneId }, include: { project: true } });
    if (!zone || zone.project.userId !== userId) throw new Error("Unauthorized");
    return prisma.session.findMany({
      where: { zoneId },
      orderBy: { startedAt: "desc" },
      select: { id: true, sessionName: true, startedAt: true, finishedAt: true }
    });
  },

  async getById(sessionId: string, userId: number) {
    const s = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { readings: { include: { diffuser: true } }, zone: { include: { project: true } }, project: true }
    });
    if (!s) throw new Error("Not found");
    if (s.userId !== userId && s.project.userId !== userId) {
      // allow the project owner (user) or the session owner (user)
      throw new Error("Unauthorized");
    }
    return s;
  },

  async finish(sessionId: string, userId: number) {
    const s = await prisma.session.findUnique({ where: { id: sessionId }, include: { project: true } });
    if (!s || s.project.userId !== userId) throw new Error("Unauthorized");
    return prisma.session.update({ where: { id: sessionId }, data: { finishedAt: new Date() } });
  }
};
