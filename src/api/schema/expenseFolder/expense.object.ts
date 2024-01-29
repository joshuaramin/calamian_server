import { objectType } from "nexus";
import { prisma } from "../../../util/index.js";


export const ExpenseFolder = objectType({
    name: "expenseFolder",
    definition(t) {
        t.id("expFolderID");
        t.string("exFolder");
        t.datetime("createdAt");
        t.list.field("getAllExpenses", {
            type: "expenses",
            resolve: async ({ expFolderID }) => {
                return await prisma.expense.findMany({
                    where: {
                        expFolder: {
                            expFolderID
                        }
                    }
                })
            }
        })
        t.int("expenseAmount", {
            resolve: async ({ expFolderID }): Promise<any> => {
                const expense = await prisma.expense.findMany({
                    where: {
                        expFolderID
                    }
                })
                return expense.reduce((a, { amount }) => (a + amount), 0)
            }
        })
    },
})