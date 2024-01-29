import { subscriptionField } from "nexus";
import { prisma, pubsub } from "../../../../util/index.js";


export const orderSubscriptions = subscriptionField("createOrders", {
    type: "order",
    subscribe: async (): Promise<any> => {
        return await pubsub.asyncIterator("createdOrders")
    },
    resolve: async (payload): Promise<any> => {
        return payload
    }
})