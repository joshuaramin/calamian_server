import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma, pubsub } from "../../../util/index.js";




export const ExpFolderMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("createExpenseFolder", {
            type: "expenseFolder",
            args: { exFolder: nonNull(stringArg()), userID: nonNull(idArg()) },
            resolve: async (_, { exFolder, userID }): Promise<any> => {
                const expFolders = await prisma.expFolder.create({
                    data: {
                        exFolder,
                        User: {
                            connect: {
                                userID
                            }
                        }
                    }
                })


                await prisma.logs.create({
                    data: {
                        logs: "Created an Expense Folder",
                        descriptions: `You created a new Expense Folder named ${expFolders.exFolder}.`,
                        User: {
                            connect: {
                                userID
                            }
                        }
                    }
                })

                pubsub.publish("createExpenseFolder", expFolders)
                return expFolders
            }
        })
        t.field("updateExpenseFolder", {
            type: "expenseFolder",
            args: { expFolderID: nonNull(idArg()), exFolder: nonNull(stringArg()), userID: nonNull(idArg()) },
            resolve: async (_, { expFolderID, exFolder, userID }): Promise<any> => {

                const expense = await prisma.expFolder.update({
                    data: { exFolder },
                    where: { expFolderID }
                })


                await prisma.logs.create({
                    data: {
                        logs: "Updated an Expense Foloder",
                        descriptions: `You updated a Expense Folder ${expense.exFolder}.`,
                        User: {
                            connect: {
                                userID
                            }
                        }
                    }
                })


                return expense
            }
        })
        t.field("deleteExpFolder", {
            type: "expenseFolder",
            args: { expFolderID: nonNull(idArg()), userID: nonNull(idArg()) },
            resolve: async (_, { expFolderID, userID }): Promise<any> => {



                const expense = await prisma.expFolder.delete({
                    where: { expFolderID }
                })

                await prisma.logs.create({
                    data: {
                        logs: "Deleted an Expense Foloder",
                        descriptions: `You deleted a Expense Folder ${expense.exFolder}.`,
                        User: {
                            connect: {
                                userID
                            }
                        }
                    }
                })

                return expense
            }
        })
    },
})