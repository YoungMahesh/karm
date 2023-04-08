import { router } from "../trpc";
import { profileRouter } from "./profile";
import { profile2Router } from "./profile2";
import { timerRouter } from "./timer";
import { timerSessionsRouter } from "./timerSessions";

export const appRouter = router({
  timer: timerRouter,
  timerSessions: timerSessionsRouter,
  profile: profileRouter,
  profile2: profile2Router,
});

// export type definition of API
export type AppRouter = typeof appRouter;
