import { createTRPCRouter, publicProcedure } from "./trpc";
import { exampleRouter } from "./routers/example";
import { chainRouter } from "./routers/chain";
import { agentRouter } from "./routers/agentRouter";
import { accountRouter } from "./routers/account";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  chain: chainRouter,
  agent: agentRouter,
  account: accountRouter,
  version: publicProcedure
    .query(() => {
      return { version: "1.0.0" };
    })
    .summary("Get the current API version"),
});

// export type definition of API
export type AppRouter = typeof appRouter;
