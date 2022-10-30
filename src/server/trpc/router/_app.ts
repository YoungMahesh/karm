import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import {guestRouter} from './guestbook'

export const appRouter = router({
  example: exampleRouter,
  guest: guestRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
