import { extendType, floatArg, idArg, inputObjectType, list, nonNull } from "nexus";
import { prisma, pubsub } from "../../../../util/index.js";




export const ExpensesInput = inputObjectType({
    name: "expenseInput",
    definition(t) {
        t.string("expense");
        t.float("amount");
        t.string("mod");
        t.date("payDate");
    },
})



export const ExepensesMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("createExpense", {
            type: "expenses",
            args: { expenses: "expenseInput", expFolderID: nonNull(idArg()) },
            resolve: async (_, { expenses: { expense, amount, mod, payDate }, expFolderID }): Promise<any> => {
                const expenses = await prisma.expense.create({
                    data: {
                        expense, amount, mod, payDate,
                        expFolder: {
                            connect: {
                                expFolderID
                            }
                        }
                    }
                })

                pubsub.publish("createExpenses", expenses)

                return expenses
            }
        })
        t.field("updateExpense", {
            type: "expenses",
            args: { expenses: "expenseInput", expenseID: nonNull(idArg()) },
            resolve: async (_, { expenses: { amount, expense, mod, payDate }, expenseID }): Promise<any> => {
                return await prisma.expense.update({
                    where: { expenseID },
                    data: {
                        amount, expense, mod, payDate
                    }
                })
            }
        })
        t.list.field("deleteExpense", {
            type: "expenses",
            args: { expenseID: nonNull(list(idArg())) },
            resolve: async (_, { expenseID }): Promise<any> => {
                expenseID.map(async (expenseID) => {
                    return await prisma.expense.deleteMany({
                        where: { expenseID }
                    })
                })

            }
        })
    }
})