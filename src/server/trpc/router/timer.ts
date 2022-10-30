import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const timerRouter = router({
  createTimer: protectedProcedure
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
          timeRemaining: req.input.totalTime,
          updatedAt: Math.floor(new Date().getTime() / 1000),
          isRunning: false,
          userId: req.ctx.session.user.id,
        },
      });
    }),

  startTimer: protectedProcedure
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
          isRunning: true,
          updatedAt: Math.floor(new Date().getTime() / 1000),
        },
      });
    }),

  stopTimer: protectedProcedure
    .input(
      z.object({
        timerId: z.string(),
        timeRemaining: z.number(),
      })
    )
    .mutation((req) => {
      return req.ctx.prisma.timer.update({
        where: {
          id: req.input.timerId,
        },
        data: {
          isRunning: false,
          timeRemaining: req.input.timeRemaining,
        },
      });
    }),

  getOne: protectedProcedure
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

  getAllIds: protectedProcedure.query((req) => {
    return req.ctx.prisma.timer.findMany({
      where: { userId: req.ctx.session.user.id },
      select: { id: true },
    });
  }),

  deleteTimer: protectedProcedure
    .input(z.object({ timerId: z.string() }))
    .mutation((req) => {
      return req.ctx.prisma.timer.delete({
        where: {
          id: req.input.timerId,
        },
      });
    }),
});
