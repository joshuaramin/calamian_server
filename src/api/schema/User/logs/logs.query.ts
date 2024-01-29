import { extendType, idArg, intArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../../../util/index.js";



export const LogsQuery = extendType({
    type: "Query",
    definition(t) {
        t.list.field("getLogByUserId", {
            type: "logs",
            args: { userID: nonNull(idArg()), orders: nonNull(stringArg()), take: nonNull(intArg()), offset: nonNull(intArg()) },
            resolve: async (_, { userID, orders, take, offset }): Promise<any> => {
                return await prisma.logs.findMany({
                    where: {
                        userID
                    },
                    orderBy: {
                        createdAt: orders as any
                    },
                    take,
                    skip: offset
                })
            }
        })
    },
})