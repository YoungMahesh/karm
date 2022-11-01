import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const profileRouter = router({
  getProfile: protectedProcedure.query(async (req) => {
    const user = await req.ctx.prisma.user.findUnique({
      where: {
        email: req.ctx.session.user.email,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }),
  updateName: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async (req) => {
      return req.ctx.prisma.user.update({
        where: {
          email: req.ctx.session.user.email,
        },
        data: {
          name: req.input.name,
        },
      });
    }),
  deleteAccount: protectedProcedure.mutation(async (req) => {
    return req.ctx.prisma.user.delete({
      where: {
        email: req.ctx.session.user.email,
      },
    });
  }),
});
