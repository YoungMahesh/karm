/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { createTRPCRouter, protected2Procedure } from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  get: protected2Procedure.query(async ({ ctx }) => {
    let user = await ctx.prisma.user.findUnique({
      where: {
        userId: ctx.userId,
      },
    });
    if (!user) {
      user = await ctx.prisma.user.create({
        data: {
          userId: ctx.userId,
        },
      });
    }

    return user;
  }),
});
