import { objectType } from "nexus";
import { prisma } from "../../../../util/index.js";


export const itemsObject = objectType({
    name: "item",
    definition(t) {
        t.id("itemsID");
        t.string("items");
        t.string("dosage");
        t.list.field("storeInfo", {
            type: "store",
            resolve: async ({ itemsID }): Promise<any> => {
                return await prisma.storeInfo.findMany({
                    where: {
                        itemsID
                    }
                })
            }
        })
        t.list.field("category", {
            type: "category",
            resolve: async ({ itemsID }): Promise<any> => {
                return await prisma.category.findMany({
                    where: {
                        items: {
                            some: {
                                itemsID
                            }
                        }
                    }
                })
            }
        })
    },
})