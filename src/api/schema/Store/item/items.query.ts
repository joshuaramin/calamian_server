import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../../../util/index.js";


export const itemQuery = extendType({
    type: "Query",
    definition(t) {
        t.list.field("getAllStoreItems", {
            type: "item",
            resolve: async (): Promise<any> => {
                return await prisma.items.findMany({
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
        });
        t.list.field("getItemBySearch", {
            type: "item",
            args: { search: nonNull(idArg()), categoryID: nonNull(idArg()) },
            resolve: async (_, { search, categoryID }): Promise<any> => {
                return await prisma.items.findMany({
                    where: {
                        NOT: {
                            Archive: {
                                some: {
                                    archive: true
                                }
                            }
                        },
                        category: {
                            some: {
                                categoryID
                            }
                        },
                        items: {
                            contains: search,
                            mode: "insensitive"
                        }
                    }
                })
            }
        })


        t.list.field("getItemsByStaff", {
            type: "item",
            args: { search: nonNull(stringArg()) },
            resolve: async (_, { search }): Promise<any> => {
                return await prisma.items.findMany({
                    where: {
                        NOT: {
                            Archive: {
                                some: {
                                    archive: true
                                }
                            }
                        },
                        items: {
                            contains: search,
                            mode: "insensitive"
                        }
                    }
                })
            }
        })

        t.list.field("getItemsById", {
            type: "item",
            args: { itemsID: nonNull(idArg()) },
            resolve: async (_, { itemsID }): Promise<any> => {
                return await prisma.items.findMany({
                    where: { itemsID }
                })
            }
        })



        t.int("getTotalNoOfItems", {
            resolve: async (): Promise<any> => {
                const items = await prisma.items.findMany()

                return items.length

            }
        })


        t.list.field("getItemsByCategoryId", {
            type: "item",
            args: { categoryID: nonNull(idArg()), },
            resolve: async (_, { categoryID }): Promise<any> => {
                return await prisma.items.findMany({
                    where: {
                        NOT: {
                            Archive: {
                                some: {

                                    archive: true
                                }
                            },
                        },
                        category: {
                            some: {
                                categoryID
                            }
                        },
                    },
                    orderBy: {
                        info: {
                            expiredDate: "asc"
                        }
                    }
                })
            }
        })

    },
})