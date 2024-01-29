import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../../util/index.js";


export const UserQuery = extendType({
    type: "Query",
    definition(t) {
        t.list.field("getAllUserAccount", {
            type: "user",
            resolve: async (): Promise<any> => {
                return await prisma.user.findMany({
                    where: {
                        NOT: {
                            Archive: {
                                some: {
                                    archive: true
                                }
                            }
                        }
                    },
                    orderBy: {
                        role: "asc"
                    }
                })
            }
        })
        t.list.field("getAllUserAccountManagerRole", {
            type: "user",
            resolve: async (): Promise<any> => {
                return await prisma.user.findMany({
                    where: {
                        Archive: {
                            every: {
                                archive: false
                            }
                        },
                        NOT: {
                            role: "admin",
                        },
                    },
                    orderBy: {
                        role: "asc"
                    }
                })
            }
        })
        t.list.field("getUserById", {
            type: "user",
            args: { userID: nonNull(idArg()) },
            resolve: async (_, { userID }): Promise<any> => {
                return await prisma.user.findMany({
                    where: { userID }
                })
            }
        })
        t.list.field("getSearchByUser", {
            type: "user",
            args: { search: nonNull(stringArg()) },
            resolve: async (_, { search }): Promise<any> => {
                return await prisma.user.findMany({
                    where: {
                        NOT: {
                            Archive: {
                                some: {
                                    archive: true
                                }
                            }
                        },
                        Profile: {
                            firstname: {
                                contains: search,
                                mode: "insensitive"
                            }
                        }
                    }
                })
            }
        })
    },
})