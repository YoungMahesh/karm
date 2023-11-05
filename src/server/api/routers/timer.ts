/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// import { type User } from "@prisma/client";
import {  createTRPCRouter, protected2Procedure } from "~/server/api/trpc";
import { z } from "zod";
import { currTime } from "~/utils/timer";

export const timerRouter = createTRPCRouter({
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
        totalTime: z.number(),
        title: z.string(),
      })
    )
    .mutation(async (req) => {
      return await req.ctx.prisma.timer.update({
        where: {
          userId_title: {
            userId: req.ctx.userId,
            title: req.input.title,
          },
        },
        data: {
          totalTime: req.input.totalTime,
        },
      });
    }),

  start: protected2Procedure
    .input(
      z.object({
        title: z.string(),
        updatedAt: z.number(),
      })
    )
    .mutation(async (req) => {
      return await req.ctx.prisma.timer.update({
        where: {
          userId_title: {
            userId: req.ctx.userId,
            title: req.input.title,
          },
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
        title: z.string(),
      })
    )
    .mutation(async (req) => {
      return await req.ctx.prisma.timer.update({
        where: {
          userId_title: {
            userId: req.ctx.userId,
            title: req.input.title,
          },
        },
        data: {
          isRunning: false,
        },
      });
    }),

  getTotalPassedTime: protected2Procedure
    .input(
      z.object({
        timerTitle: z.string(),
      })
    )
    .query(async (req) => {
      return await req.ctx.prisma.timerSessions.aggregate({
        where: {
          Timer: {
            userId: req.ctx.userId,
            title: req.input.timerTitle,
          },
        },
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
        select: { id: true, title: true },
        orderBy: { title: "asc" },
        skip: (req.input.page - 1) * req.input.limit,
        take: req.input.limit,
      });
    }),

  delete: protected2Procedure
    .input(z.object({ title: z.string() }))
    .mutation(async (req) => {
      return await req.ctx.prisma.timer.delete({
        where: {
          userId_title: {
            userId: req.ctx.userId,
            title: req.input.title,
          },
        },
      });
    }),
});
