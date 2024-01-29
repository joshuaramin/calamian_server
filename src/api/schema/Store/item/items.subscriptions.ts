import { idArg, nonNull, subscriptionField } from "nexus";
import { prisma, pubsub } from "../../../../util/index.js";





export const itemSubscriptions = subscriptionField("createItemSubscriptions", {
    type: "item",
    args: {
        categoryID: nonNull(idArg())
    },
    subscribe: async (): Promise<any> => {
        return await pubsub.asyncIterator("createItems")
    },
    resolve: async (payload): Promise<any> => {
        return await payload
    }
})  