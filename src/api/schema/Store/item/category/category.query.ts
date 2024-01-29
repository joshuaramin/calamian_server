import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../../../../util/index.js";


export const CategoryQuery = extendType({
    type: "Query",
    definition(t) {
        t.list.field("getAllCategory", {
            type: "category",
            resolve: async (): Promise<any> => {
                return await prisma.category.findMany({
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
        t.list.field("getCategotiesById", {
            type: "category",
            args: { categoryID: nonNull(idArg()) },
            resolve: async (_, { categoryID }): Promise<any> => {
                return await prisma.category.findMany({
                    where: {
                        categoryID
                    }
                })
            }
        })
        t.list.field("getSearchCategory", {
            type: "category",
            args: { search: nonNull(stringArg()) },
            resolve: async (_, { search }): Promise<any> => {
                return await prisma.category.findMany({
                    where: {
                        NOT: {
                            Archive: {
                                some: {
                                    archive: true
                                }
                            }
                        },
                        category: {
                            contains: search,
                            mode: "insensitive"
                        }
                    }
                })
            }
        })
    },
})