import { router } from "../trpc";
import { profileRouter } from "./profile";
import { timerRouter } from "./timer";

export const appRouter = router({
  timer: timerRouter,
  profile: profileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
