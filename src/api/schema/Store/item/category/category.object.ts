import { objectType } from "nexus";
import { prisma } from "../../../../../util/index.js";


export const CategoryObject = objectType({
    name: "category",
    definition(t) {
        t.id("categoryID");
        t.string("category");
        t.datetime("createdAt");
        t.datetime("updatedAt");
        t.list.field("items", {
            type: "item",
            resolve: async ({ categoryID }): Promise<any> => {
                return await prisma.items.findMany({
                    where: {
                        category: {
                            some: {
                                categoryID
                            }
                        }
                    }
                })
            }
        })
        t.int("totalNumberOfItems", {
            resolve: async ({ categoryID }): Promise<any> => {
                return await prisma.items.count({
                    where: {
                        category: {
                            some: {
                                categoryID,
                            }
                        },
                    },
                })
            }
        })
    },
})