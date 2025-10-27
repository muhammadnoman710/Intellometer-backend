import prisma from "../config/prisma";
import { toCFM, toCelsius } from "../utils/units";

export const ReadingService = {
  // create/update reading for diffuser inside session
  async save(sessionId: string, diffuserId: string, userId: number, payload: any) {
    // validate session and ownership
    const session = await prisma.session.findUnique({ where: { id: sessionId }, include: { project: true } });
    if (!session) throw new Error("Session not found");
    if (session.project.userId !== userId) throw new Error("Unauthorized");

    // verify diffuser belongs to same zone
    const diffuser = await prisma.diffuser.findUnique({ where: { id: diffuserId }, include: { zone: true } });
    if (!diffuser || diffuser.zoneId !== session.zoneId) throw new Error("Diffuser not in session zone");

    // normalize units
    const requiredCFM_raw = payload.requiredCFM?.value ? String(payload.requiredCFM.value) : payload.requiredCFM_raw ?? null;
    const requiredCFM_unit = payload.requiredCFM?.unit ?? payload.requiredCFM_unit ?? null;
    let requiredCFM = null;
    if (requiredCFM_raw && requiredCFM_unit) {
      requiredCFM = toCFM(Number(requiredCFM_raw), requiredCFM_unit);
    }

    const actualCFM_raw = payload.actualCFM?.value ? String(payload.actualCFM.value) : payload.actualCFM_raw ?? null;
    const actualCFM_unit = payload.actualCFM?.unit ?? payload.actualCFM_unit ?? null;
    let actualCFM = null;
    if (actualCFM_raw && actualCFM_unit) {
      actualCFM = toCFM(Number(actualCFM_raw), actualCFM_unit);
    }

    const requiredTemp_raw = payload.requiredTemp?.value ? String(payload.requiredTemp.value) : payload.requiredTemp_raw ?? null;
    const requiredTemp_unit = payload.requiredTemp?.unit ?? payload.requiredTemp_unit ?? null;
    let requiredTemp = null;
    if (requiredTemp_raw && requiredTemp_unit) requiredTemp = toCelsius(Number(requiredTemp_raw), requiredTemp_unit);

    const actualTemp_raw = payload.actualTemp?.value ? String(payload.actualTemp.value) : payload.actualTemp_raw ?? null;
    const actualTemp_unit = payload.actualTemp?.unit ?? payload.actualTemp_unit ?? null;
    let actualTemp = null;
    if (actualTemp_raw && actualTemp_unit) actualTemp = toCelsius(Number(actualTemp_raw), actualTemp_unit);

    const grillTemp_raw = payload.grillTemp?.value ? String(payload.grillTemp.value) : payload.grillTemp_raw ?? null;
    const grillTemp_unit = payload.grillTemp?.unit ?? payload.grillTemp_unit ?? null;
    let grillTemp = null;
    if (grillTemp_raw && grillTemp_unit) grillTemp = toCelsius(Number(grillTemp_raw), grillTemp_unit);

    // voltage & amperes numeric:
    const voltage = payload.voltage !== undefined ? Number(payload.voltage) : null;
    const amperes = payload.amperes !== undefined ? Number(payload.amperes) : null;

    // create reading row
    const reading = await prisma.reading.create({
      data: {
        sessionId,
        diffuserId,
        projectName: payload.projectName,
        areaName: payload.areaName,
        requiredCFM_raw,
        requiredCFM,
        requiredCFM_unit,
        actualCFM_raw,
        actualCFM,
        actualCFM_unit,
        requiredTemp_raw,
        requiredTemp,
        requiredTemp_unit,
        actualTemp_raw,
        actualTemp,
        actualTemp_unit,
        grillTemp_raw,
        grillTemp,
        grillTemp_unit,
        voltage,
        amperes,
      }
    });

    return reading;
  },

  async getByDiffuser(diffuserId: string, userId: number) {
    // ensure ownership via zone->project->user
    const d = await prisma.diffuser.findUnique({ where: { id: diffuserId }, include: { zone: { include: { project: true } } } });
    if (!d || d.zone.project.userId !== userId) throw new Error("Unauthorized");
    return prisma.reading.findMany({ where: { diffuserId }, orderBy: { createdAt: "desc" } });
  },

  async getForSession(sessionId: string, userId: number) {
    const s = await prisma.session.findUnique({ where: { id: sessionId }, include: { project: true } });
    if (!s || s.project.userId !== userId) throw new Error("Unauthorized");
    return prisma.reading.findMany({ where: { sessionId }, include: { diffuser: true } });
  },

  // Get a reading by ID with user authorization
  async getById(readingId: string, userId: number) {
    const reading = await prisma.reading.findUnique({
      where: { id: readingId },
      include: {
        diffuser: {
          include: {
            zone: {
              include: {
                project: true
              }
            }
          }
        }
      }
    });
    
    if (!reading || reading.diffuser.zone.project.userId !== userId) {
      throw new Error("Reading not found or unauthorized");
    }
    
    return reading;
  },

  // Update a reading
  async update(readingId: string, userId: number, payload: any) {
    // First verify ownership
    await this.getById(readingId, userId);

    // Normalize units (same logic as save method)
    const requiredCFM_raw = payload.requiredCFM?.value ? String(payload.requiredCFM.value) : payload.requiredCFM_raw ?? undefined;
    const requiredCFM_unit = payload.requiredCFM?.unit ?? payload.requiredCFM_unit ?? undefined;
    let requiredCFM = undefined;
    if (requiredCFM_raw && requiredCFM_unit) {
      requiredCFM = toCFM(Number(requiredCFM_raw), requiredCFM_unit);
    }

    const actualCFM_raw = payload.actualCFM?.value ? String(payload.actualCFM.value) : payload.actualCFM_raw ?? undefined;
    const actualCFM_unit = payload.actualCFM?.unit ?? payload.actualCFM_unit ?? undefined;
    let actualCFM = undefined;
    if (actualCFM_raw && actualCFM_unit) {
      actualCFM = toCFM(Number(actualCFM_raw), actualCFM_unit);
    }

    const requiredTemp_raw = payload.requiredTemp?.value ? String(payload.requiredTemp.value) : payload.requiredTemp_raw ?? undefined;
    const requiredTemp_unit = payload.requiredTemp?.unit ?? payload.requiredTemp_unit ?? undefined;
    let requiredTemp = undefined;
    if (requiredTemp_raw && requiredTemp_unit) requiredTemp = toCelsius(Number(requiredTemp_raw), requiredTemp_unit);

    const actualTemp_raw = payload.actualTemp?.value ? String(payload.actualTemp.value) : payload.actualTemp_raw ?? undefined;
    const actualTemp_unit = payload.actualTemp?.unit ?? payload.actualTemp_unit ?? undefined;
    let actualTemp = undefined;
    if (actualTemp_raw && actualTemp_unit) actualTemp = toCelsius(Number(actualTemp_raw), actualTemp_unit);

    const grillTemp_raw = payload.grillTemp?.value ? String(payload.grillTemp.value) : payload.grillTemp_raw ?? undefined;
    const grillTemp_unit = payload.grillTemp?.unit ?? payload.grillTemp_unit ?? undefined;
    let grillTemp = undefined;
    if (grillTemp_raw && grillTemp_unit) grillTemp = toCelsius(Number(grillTemp_raw), grillTemp_unit);

    const voltage = payload.voltage !== undefined ? Number(payload.voltage) : undefined;
    const amperes = payload.amperes !== undefined ? Number(payload.amperes) : undefined;

    const updateData: any = {};
    if (payload.projectName !== undefined) updateData.projectName = payload.projectName;
    if (payload.areaName !== undefined) updateData.areaName = payload.areaName;
    if (requiredCFM_raw !== undefined) updateData.requiredCFM_raw = requiredCFM_raw;
    if (requiredCFM !== undefined) updateData.requiredCFM = requiredCFM;
    if (requiredCFM_unit !== undefined) updateData.requiredCFM_unit = requiredCFM_unit;
    if (actualCFM_raw !== undefined) updateData.actualCFM_raw = actualCFM_raw;
    if (actualCFM !== undefined) updateData.actualCFM = actualCFM;
    if (actualCFM_unit !== undefined) updateData.actualCFM_unit = actualCFM_unit;
    if (requiredTemp_raw !== undefined) updateData.requiredTemp_raw = requiredTemp_raw;
    if (requiredTemp !== undefined) updateData.requiredTemp = requiredTemp;
    if (requiredTemp_unit !== undefined) updateData.requiredTemp_unit = requiredTemp_unit;
    if (actualTemp_raw !== undefined) updateData.actualTemp_raw = actualTemp_raw;
    if (actualTemp !== undefined) updateData.actualTemp = actualTemp;
    if (actualTemp_unit !== undefined) updateData.actualTemp_unit = actualTemp_unit;
    if (grillTemp_raw !== undefined) updateData.grillTemp_raw = grillTemp_raw;
    if (grillTemp !== undefined) updateData.grillTemp = grillTemp;
    if (grillTemp_unit !== undefined) updateData.grillTemp_unit = grillTemp_unit;
    if (voltage !== undefined) updateData.voltage = voltage;
    if (amperes !== undefined) updateData.amperes = amperes;

    return prisma.reading.update({
      where: { id: readingId },
      data: updateData
    });
  },

  // Get readings by date
  async getByDate(date: string, userId: number) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    return prisma.reading.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate
        },
        diffuser: {
          zone: {
            project: {
              userId: userId
            }
          }
        }
      },
      include: {
        diffuser: {
          include: {
            zone: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  },

  // Get readings by zone
  async getByZone(zoneId: string, userId: number) {
    // Verify zone ownership
    const zone = await prisma.zone.findUnique({
      where: { id: zoneId },
      include: { project: true }
    });
    
    if (!zone || zone.project.userId !== userId) {
      throw new Error("Zone not found or unauthorized");
    }

    return prisma.reading.findMany({
      where: {
        diffuser: {
          zoneId: zoneId
        }
      },
      include: {
        diffuser: true
      },
      orderBy: { createdAt: "desc" }
    });
  }
};
