import { router } from "../trpc";
import { profileRouter } from "./profile";
import { timerRouter } from "./timer";
import { timerSessionsRouter } from "./timerSessions";

export const appRouter = router({
  timer: timerRouter,
  timerSessions: timerSessionsRouter,
  profile: profileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
