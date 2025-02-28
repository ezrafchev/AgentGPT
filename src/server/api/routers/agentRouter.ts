import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { PrismaClient } from "@prisma/client";
import { inferProcedureOutput } from "@trpc/server";

const prisma = new PrismaClient();

export const agentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        goal: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const agent = await prisma.agent.create({
        data: {
          name: input.name,
          goal: input.goal,
          userId: ctx.session?.user?.id,
        },
      });

      return agent;
    }),
  getAll: protectedProcedure.query(async ({ ctx }): inferProcedureOutput<typeof getAll> => {
    return prisma.agent.findMany({
      where: { userId: ctx.session?.user?.id },
    });
  }),
});
