import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../../util/index.js";




export const expFolderQuery = extendType({
    type: "Query",
    definition(t) {
        t.list.field("getAllExpenseFolder", {
            type: "expenseFolder",
            resolve: async (): Promise<any> => {
                return await prisma.expFolder.findMany({
                    where: {
                        NOT: {
                            Archive: {
                                some: {
                                    archive: true
                                }
                            }
                        }
                    }
                })
            }
        })

        t.list.field("getExpenseFolderById", {
            type: "expenseFolder",
            args: { expFolderID: nonNull(idArg()) },
            resolve: async (_, { expFolderID }): Promise<any> => {
                return await prisma.expFolder.findMany({
                    where: {
                        expFolderID
                    }
                })
            }
        })
        t.list.field("getSearchByFolderName", {
            type: "expenseFolder",
            args: { search: nonNull(stringArg()) },
            resolve: async (_, { search }): Promise<any> => {
                return await prisma.expFolder.findMany({
                    where: {
                        NOT: {
                            Archive: {
                                some: {
                                    archive: true
                                }
                            }
                        },
                        exFolder: {
                            contains: search,
                            mode: "insensitive"
                        }
                    }
                })
            }
        })
    },
})