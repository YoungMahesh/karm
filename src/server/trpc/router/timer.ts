import { z } from "zod";
import { currTime } from "../../../utils/timer";
import { protected2Procedure, router } from "../trpc";

export const timerRouter = router({
  create: protected2Procedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        totalTime: z.number(),
      })
    )
    .mutation(async (req) => {
      return await req.ctx.prisma.timer.create({
        data: {
          title: req.input.title,
          description: req.input.description,
          totalTime: req.input.totalTime,
          updatedAt: currTime(),
          isRunning: false,
          userId: req.ctx.userId,
        },
      });
    }),

  get: protected2Procedure
    .input(
      z.object({
        timerId: z.number(),
      })
    )
    .query(async (req) => {
      return await req.ctx.prisma.timer.findUnique({
        where: { id: req.input.timerId },
      });
    }),

  updateTotalTime: protected2Procedure
    .input(
      z.object({
        timerId: z.number(),
        totalTime: z.number(),
      })
    )
    .mutation(async (req) => {
      return await req.ctx.prisma.timer.update({
        where: { id: req.input.timerId },
        data: {
          totalTime: req.input.totalTime,
        },
      });
    }),

  start: protected2Procedure
    .input(
      z.object({
        timerId: z.number(),
        updatedAt: z.number(),
      })
    )
    .mutation(async (req) => {
      return await req.ctx.prisma.timer.update({
        where: {
          id: req.input.timerId,
        },
        data: {
          isRunning: true,
          updatedAt: req.input.updatedAt,
        },
      });
    }),

  stop: protected2Procedure
    .input(
      z.object({
        timerId: z.number(),
      })
    )
    .mutation(async (req) => {
      return await req.ctx.prisma.timer.update({
        where: {
          id: req.input.timerId,
        },
        data: {
          isRunning: false,
        },
      });
    }),

  getTotalPassedTime: protected2Procedure
    .input(
      z.object({
        timerId: z.number(),
      })
    )
    .query(async (req) => {
      return await req.ctx.prisma.timerSessions.aggregate({
        where: { timerId: req.input.timerId },
        _sum: { timePassed: true },
      });
    }),

  getAllIds: protected2Procedure
    .input(
      z.object({
        page: z.number(),
        limit: z.number(),
      })
    )
    .query(async (req) => {
      return await req.ctx.prisma.timer.findMany({
        where: {
          userId: req.ctx.userId,
        },
        select: { id: true },
        orderBy: { title: "asc" },
        skip: (req.input.page - 1) * req.input.limit,
        take: req.input.limit,
      });
    }),

  delete: protected2Procedure
    .input(z.object({ timerId: z.number() }))
    .mutation(async (req) => {
      return await req.ctx.prisma.timer.delete({
        where: {
          id: req.input.timerId,
        },
      });
    }),
});
