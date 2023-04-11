import { type User } from "@prisma/client";
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
});
