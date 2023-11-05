import { createTRPCRouter } from "~/server/api/trpc";
import { profileRouter } from "./routers/profile";
import { timerRouter } from "./routers/timer";
import { timerSessionsRouter } from "./routers/timerSessions";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  profile: profileRouter,
  timer: timerRouter,
  timerSessions: timerSessionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
