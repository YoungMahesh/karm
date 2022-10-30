import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { guestRouter } from "./guestbook";
import { timerRouter } from "./timer";

export const appRouter = router({
  auth: authRouter,
  example: exampleRouter,
  guest: guestRouter,
  timer: timerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
