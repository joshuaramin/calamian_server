import { subscriptionField } from "nexus";
import { prisma, pubsub } from "../../../util/index.js";



export const expenseFolderSubscriptions = subscriptionField("expenseFolderSubscriptions", {
    type: "expenseFolder",
    subscribe: async(): Promise<any> => {
        return pubsub.asyncIterator("createExpenseFolder")
    },
    resolve: async(payload): Promise<any> => {
        return await payload
    }
})