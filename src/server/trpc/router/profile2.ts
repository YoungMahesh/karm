import { z } from "zod";
import { protected2Procedure, router } from "../trpc";

export const profile2Router = router({
  get: protected2Procedure.query(async (req) => {
    // const user = await req.ctx.prisma.user.findUnique({
    //   where: {
    //     email: req.ctx.user.userId,
    //   },
    // });
    const user = req.ctx.user;
    if (!user) {
      throw new Error("User not found");
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
