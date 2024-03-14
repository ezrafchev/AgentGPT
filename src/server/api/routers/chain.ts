import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { startGoalAgent } from "../../../utils/chain";

export const chainRouter = createTRPCRouter({
  startAgent: publicProcedure
    .input(z.object({ prompt: z.string().nonempty() }))
    .mutation(async ({ input }) => {
      try {
        const completion = await startGoalAgent(input.prompt);
        return { tasks: completion.tasks };
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while starting the agent.",
        });
      }
    }),
});
