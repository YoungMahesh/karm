import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const timerSessionsRouter = router({
  createTimerSession: protectedProcedure
    .input(
      z.object({
        timerId: z.string(),
        startTime: z.number(),
        endTime: z.number(),
        timePassed: z.number(),
      })
    )
    .mutation((req) => {
      return req.ctx.prisma.timerSessions.create({
        data: {
          timerId: req.input.timerId,
          startTime: req.input.startTime,
          endTime: req.input.endTime,
          timePassed: req.input.timePassed,
        },
      });
    }),

  // startTimer: protectedProcedure
  //   .input(
  //     z.object({
  //       timerId: z.string(),
  //     })
  //   )
  //   .mutation((req) => {
  //     return req.ctx.prisma.timer.update({
  //       where: {
  //         id: req.input.timerId,
  //       },
  //       data: {
  //         isRunning: true,
  //         updatedAt: currTime(),
  //       },
  //     });
  //   }),

  // stopTimer: protectedProcedure
  //   .input(
  //     z.object({
  //       timerId: z.string(),
  //       timeRemaining: z.number(),
  //     })
  //   )
  //   .mutation((req) => {
  //     return req.ctx.prisma.timer.update({
  //       where: {
  //         id: req.input.timerId,
  //       },
  //       data: {
  //         isRunning: false,
  //         timeRemaining: req.input.timeRemaining,
  //       },
  //     });
  //   }),

  // getOne: protectedProcedure
  //   .input(
  //     z.object({
  //       timerId: z.string(),
  //     })
  //   )
  //   .query((req) => {
  //     return req.ctx.prisma.timer.findUnique({
  //       where: { id: req.input.timerId },
  //     });
  //   }),

  // getAllIds: protectedProcedure.query((req) => {
  //   return req.ctx.prisma.timer.findMany({
  //     where: { userEmail: req.ctx.session.user.email },
  //     select: { id: true },
  //   });
  // }),

  // deleteTimer: protectedProcedure
  //   .input(z.object({ timerId: z.string() }))
  //   .mutation((req) => {
  //     return req.ctx.prisma.timer.delete({
  //       where: {
  //         id: req.input.timerId,
  //       },
  //     });
  //   }),
});
