import { type inferAsyncReturnType } from "@trpc/server";
import type * as trpcNext from "@trpc/server/adapters/next";
import { clerkClient } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";

export async function createContext({
  req,
  res,
}: trpcNext.CreateNextContextOptions) {
  // Create your context based on the request object
  // Will be available as `ctx` in all your resolvers
  // This is just an example of something you might want to do in your ctx fn
  const { userId } = getAuth(req);
  if (!userId) return {user: null};
  const user = userId ? await clerkClient.users.getUser(userId) : null;
  return {user};
}

export type Context = inferAsyncReturnType<typeof createContext>;
