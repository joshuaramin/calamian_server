import { Prisma, PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClient =
  globalThis.prisma ??
  new PrismaClient({
    log: ["query", "info", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalThis.prisma = prismaClient;

export const prisma = prismaClient;
export const pubsub = new PubSub();
