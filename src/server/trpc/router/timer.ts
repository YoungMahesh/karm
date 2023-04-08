import { z } from "zod";
import { currTime } from "../../../utils/timer";
import { protected2Procedure, protectedProcedure, router } from "../trpc";

export const timerRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        totalTime: z.number(),
      })
    )
    .mutation((req) => {
      return req.ctx.prisma.timer.create({
        data: {
          title: req.input.title,
          description: req.input.description,
          totalTime: req.input.totalTime,
          updatedAt: currTime(),
          isRunning: false,
          userEmail: req.ctx.session.user.email,
        },
      });
    }),

  get: protectedProcedure
    .input(
      z.object({
        timerId: z.string(),
      })
    )
    .query((req) => {
      return req.ctx.prisma.timer.findUnique({
        where: { id: req.input.timerId },
      });
    }),

  updateTotalTime: protectedProcedure
    .input(
      z.object({
        timerId: z.string(),
        totalTime: z.number(),
      })
    )
    .mutation((req) => {
      return req.ctx.prisma.timer.update({
        where: { id: req.input.timerId },
        data: {
          totalTime: req.input.totalTime,
        },
      });
    }),

  start: protectedProcedure
    .input(
      z.object({
        timerId: z.string(),
        updatedAt: z.number(),
      })
    )
    .mutation((req) => {
      return req.ctx.prisma.timer.update({
        where: {
          id: req.input.timerId,
        },
        data: {
          isRunning: true,
          updatedAt: req.input.updatedAt,
        },
      });
    }),

  stop: protectedProcedure
    .input(
      z.object({
        timerId: z.string(),
      })
    )
    .mutation((req) => {
      return req.ctx.prisma.timer.update({
        where: {
          id: req.input.timerId,
        },
        data: {
          isRunning: false,
        },
      });
    }),

  getTotalPassedTime: protectedProcedure
    .input(
      z.object({
        timerId: z.string(),
      })
    )
    .query((req) => {
      return req.ctx.prisma.timerSessions.aggregate({
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
    .query((req) => {
      return req.ctx.prisma.timer.findMany({
        where: {
          user: {
            userId: req.ctx.userId,
          },
        },
        select: { id: true },
        orderBy: { title: "asc" },
        skip: (req.input.page - 1) * req.input.limit,
        take: req.input.limit,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ timerId: z.string() }))
    .mutation((req) => {
      return req.ctx.prisma.timer.delete({
        where: {
          id: req.input.timerId,
        },
      });
    }),
});
