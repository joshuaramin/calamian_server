import { subscriptionField } from "nexus";
import { prisma, pubsub } from "../../../util/index.js";


export const UserSubscriptions = subscriptionField("createUserSubscriptions", {
    type: "user",
    subscribe: async (): Promise<any> => {
        return await pubsub.asyncIterator("createUser")
    },
    resolve: async (payload): Promise<any> => {
        return payload
    }
})