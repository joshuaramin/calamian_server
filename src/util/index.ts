import { PubSub } from "graphql-subscriptions"

import { PrismaClient } from "@prisma/client"


export const pubsub = new PubSub();
export const prisma = new PrismaClient()