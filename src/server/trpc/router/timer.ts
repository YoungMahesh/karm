import { z } from "zod";
import { currTime } from "../../../utils/timer";
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
          updatedAt: currTime(),
          isRunning: false,
          userEmail: req.ctx.session.user.email,
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
          updatedAt: currTime(),
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

  getTotalTime: protectedProcedure
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

  getAllIds: protectedProcedure.query((req) => {
    return req.ctx.prisma.timer.findMany({
      where: { userEmail: req.ctx.session.user.email },
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
