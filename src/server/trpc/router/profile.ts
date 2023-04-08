import { type User } from "@prisma/client";
import { z } from "zod";
import { protected2Procedure, router } from "../trpc";

export const profileRouter = router({
  get: protected2Procedure.query(async (req) => {
    let user: User | null = await req.ctx.prisma.user.findUnique({
      where: {
        userId: req.ctx.userId,
      },
    });
    if (!user) {
      user = await req.ctx.prisma.user.create({
        data: {
          userId: req.ctx.userId,
        },
      });
    }

    return user;
  }),
  // update: protectedProcedure
  //   .input(z.object({ name: z.string() }))
  //   .mutation(async (req) => {
  //     return req.ctx.prisma.user.update({
  //       where: {
  //         email: req.ctx.session.user.email,
  //       },
  //       data: {
  //         name: req.input.name,
  //       },
  //     });
  //   }),
  // delete: protectedProcedure.mutation(async (req) => {
  //   return req.ctx.prisma.user.delete({
  //     where: {
  //       email: req.ctx.session.user.email,
  //     },
  //   });
  // }),
});
