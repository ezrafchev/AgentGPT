import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import Stripe from "stripe";
import { env } from "../../../env/server.mjs";
import { prisma } from "../../db";
import { getCustomerId } from "../../../utils/stripe-utils";

Stripe.setAppInfo({
  name: "My App",
  version: "1.0.0",
});
Stripe.setApiVersion("2022-11-15");

const stripe = new Stripe(env.STRIPE_SECRET_KEY ?? "", {});

export const accountRouter = createTRPCRouter({
  subscribe: protectedProcedure.mutation(async ({ ctx }) => {
    const { id } = ctx.session?.user || {};

    const userSchema = z.object({
      id: z.string(),
      email: z.string().optional(),
      customerId: z.string().optional(),
    });

    const user = userSchema.parse(await prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    }));

    const customer = await stripe.customers.create({
      email: user.email,
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      success_url: env.NEXTAUTH_URL,
      cancel_url: env.NEXTAUTH_URL,
      mode: "subscription",
      line_items: [
        {
          price: env.STRIPE_SUBSCRIPTION_PRICE_ID ?? "",
          quantity: 1,
        },
      ],
      customer: customer.id,
      client_reference_id: id,
      metadata: {
        userId: id,
      },
    });
