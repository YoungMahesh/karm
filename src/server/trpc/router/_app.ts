import { router } from "../trpc";
import { timerRouter } from "./timer";

export const appRouter = router({
  timer: timerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
