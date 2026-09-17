import { randomBytes } from "crypto";
import prisma from "../../lib/prisma";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export const SessionService = {
  async create(userId: string) {
    const sessionId = randomBytes(32).toString("hex");

    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

    await prisma.session.create({
      data: {
        id: sessionId,
        userId,
        expiresAt,
      },
    });

    return {
      id: sessionId,
      expiresAt,
    };
  },

  async getUser(sessionId: string) {
    const session = await prisma.session.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!session) {
      return null;
    }

    // Session expired
    if (session.expiresAt <= new Date()) {
      await prisma.session.delete({
        where: {
          id: session.id,
        },
      });

      return null;
    }

    return session.user;
  },

  async delete(sessionId: string) {
    await prisma.session.deleteMany({
      where: {
        id: sessionId,
      },
    });
  },
};
