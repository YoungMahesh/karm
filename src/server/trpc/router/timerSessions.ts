import { z } from "zod";
import { protected2Procedure, router } from "../trpc";

export const timerSessionsRouter = router({
  create: protected2Procedure
    .input(
      z.object({
        timerId: z.string(),
        startTime: z.number(),
        endTime: z.number(),
        timePassed: z.number(),
      })
    )
    .mutation(async (req) => {
      return await req.ctx.prisma.timerSessions.create({
        data: {
          timerId: req.input.timerId,
          startTime: req.input.startTime,
          endTime: req.input.endTime,
          timePassed: req.input.timePassed,
          userId: req.ctx.userId,
        },
      });
    }),

  get: protected2Procedure
    .input(
      z.object({
        timerSessionId: z.string(),
      })
    )
    .query(async (req) => {
      const tSession = await req.ctx.prisma.timerSessions.findUnique({
        where: { id: req.input.timerSessionId },
        include: { timer: { select: { title: true } } },
      });
      return tSession;
    }),

  getAllIds: protected2Procedure
    .input(
      z.object({
        page: z.number(),
        limit: z.number(),
      })
    )

    .query(async (req) => {
      const tSessions = await req.ctx.prisma.timerSessions.findMany({
        where: { userId: req.ctx.userId },
        select: { id: true },
        orderBy: { endTime: "desc" },
        skip: (req.input.page - 1) * req.input.limit,
        take: req.input.limit,
      });
      return tSessions;
    }),

  getAllIdsCount: protected2Procedure.query(async (req) => {
    return await req.ctx.prisma.timerSessions.count({
      where: { userId: req.ctx.userId },
    });
  }),

  update: protected2Procedure
    .input(
      z.object({
        timerSessionId: z.string(),
        startTime: z.number(),
        endTime: z.number(),
        timePassed: z.number(),
      })
    )
    .mutation(async (req) => {
      return await req.ctx.prisma.timerSessions.update({
        where: {
          id: req.input.timerSessionId,
        },
        data: {
          startTime: req.input.startTime,
          endTime: req.input.endTime,
          timePassed: req.input.timePassed,
        },
      });
    }),

  delete: protected2Procedure
    .input(z.object({ timerSessionId: z.string() }))
    .mutation(async (req) => {
      return await req.ctx.prisma.timerSessions.delete({
        where: {
          id: req.input.timerSessionId,
        },
      });
    }),
});
