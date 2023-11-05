import { initTRPC, TRPCError } from '@trpc/server';
import { type Context } from '~/server/contexts';
export const t = initTRPC.context<Context>().create();
import { db } from "~/server/db";

const isAuthed = t.middleware((opts) => {
  const { ctx } = opts;
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return opts.next({
    ctx: {
      prisma: db,
      user: ctx.user,
      userId: ctx.user.id
    },
  });
});

// you can reuse this for any procedure
export const protected2Procedure = t.procedure.use(isAuthed);

