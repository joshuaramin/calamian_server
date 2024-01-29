import { idArg, nonNull, subscriptionField } from "nexus";
import { prisma, pubsub } from "../../../../util/index.js";



export const ExpenseSubscriptions = subscriptionField("expensesSubscriptions", {
    type: "expenses",
    args: { expFolderID: nonNull(idArg()) },
    subscribe: async (): Promise<any> => {
        return pubsub.asyncIterator("createExpenses")
    },
    resolve: async (payload): Promise<any> => {
        return payload
    }
})