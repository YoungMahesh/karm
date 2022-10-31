import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const profileRouter = router({
  getProfile: protectedProcedure.query(async (req) => {
    const user = await req.ctx.prisma.user.findUnique({
      where: {
        id: req.ctx.session.user.id,
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
          id: req.ctx.session.user.id,
        },
        data: {
          name: req.input.name,
        },
      });
    }),
});
