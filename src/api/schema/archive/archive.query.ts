import { extendType } from "nexus";
import { prisma } from "../../../util/index.js";


export const ArchiveQuery = extendType({
    type: "Query",
    definition(t) {
        t.list.field("getAllArchiveByTab", {
            type: "archive",
            args: { tab: "tab" },
            resolve: async (_, { tab }): Promise<any> => {
                return await prisma.archive.findMany({
                    where: {
                        tab
                    }
                })
            }
        })
    },
})