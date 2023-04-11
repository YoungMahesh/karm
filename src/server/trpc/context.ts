import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";

import { prisma } from "../db/client";
import { getAuth } from "@clerk/nextjs/server";
import type {
  SignedInAuthObject,
  SignedOutAuthObject,
} from "@clerk/nextjs/dist/api";

type CreateContextOptions = {
  user: SignedInAuthObject | SignedOutAuthObject;
};

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://beta.create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    prisma,
    user: opts.user,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  const { req } = opts;

  // Get the session from the server using the unstable_getServerSession wrapper function

  function getUserFromHeader() {
    return getAuth(req);
  }
  const user = getUserFromHeader();

  return await createContextInner({
    user,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
