import type { GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./db";
import { serverEnv } from "../env/schema.mjs";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: "ADMIN";
      subscriptionId?: string;
    };
  }

  interface User {
    id: string;
    role?: "ADMIN";
    subscriptionId?: string;
  }
}

const providers = [
  GoogleProvider({
    clientId: serverEnv.GOOGLE_CLIENT_ID ?? "",
    clientSecret: serverEnv.GOOGLE_CLIENT_SECRET ?? "",
    allowDangerousEmailAccountLinking: true,
  }),
  GithubProvider({
    clientId: serverEnv.GITHUB_CLIENT_ID ?? "",
    clientSecret: serverEnv.GITHUB_CLIENT_SECRET ?? "",
    allowDangerousEmailAccountLinking: true,
  }),
  DiscordProvider({
    clientId: serverEnv.DISCORD_CLIENT_ID ?? "",
    clientSecret: serverEnv.DISCORD_CLIENT_SECRET ?? "",
    allowDangerousEmailAccountLinking: true,
  }),
];

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
        session.user.subscriptionId = user.subscriptionId;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: providers,
  theme: {
    colorScheme: "dark",
    logo: "https://agentgpt.reworkd.ai/logo-white.svg",
  },
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
