import { objectType } from "nexus";
import { prisma } from "../../../util/index.js";



export const ArchiveObject = objectType({
    name: "archive",
    definition(t) {
        t.id("archiveID");
        t.boolean("archive");
        t.datetime("createdAt");
        t.datetime("updatedAt");
        t.list.field("user", {
            type: "user",
            resolve: async ({ archiveID }): Promise<any> => {
                return await prisma.user.findMany({
                    where: {
                        Archive: {
                            some: {
                                archiveID
                            }
                        }
                    }
                })
            }
        })
        t.list.field("expenseFolder", {
            type: "expenseFolder",
            resolve: async ({ archiveID }): Promise<any> => {
                return await prisma.expFolder.findMany({
                    where: {
                        Archive: {
                            some: {
                                archiveID
                            }
                        }
                    }
                })
            }
        })

        t.list.field("categories", {
            type: "category",
            resolve: async ({ archiveID }): Promise<any> => {
                return await prisma.category.findMany({
                    where: {
                        Archive: { some: { archiveID } }
                    }
                })
            }
        })

        t.list.field("items", {
            type: "item",
            resolve: async ({ archiveID }): Promise<any> => {
                return await prisma.items.findMany({
                    where: {
                        Archive: {
                            some: {
                                archiveID
                            }
                        }
                    }
                })
            }
        })
    },
})