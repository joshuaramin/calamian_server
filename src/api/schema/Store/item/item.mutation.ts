import { extendType, idArg, inputObjectType, nonNull } from "nexus";
import { prisma, pubsub } from "../../../../util/index.js";


export const itemInput = inputObjectType({
    name: "itemInput",
    definition(t) {
        t.string("items");
        t.float("price");
        t.int("quantity");
        t.nullable.date("expiredDate");
        t.string("dosage");
    },
})

export const ItemMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("createMedicalItems", {
            type: "item",
            args: { items: "itemInput", categoryID: nonNull(idArg()), userID: nonNull(idArg()) },
            resolve: async (_, { categoryID, items: { items, expiredDate, dosage, price, quantity }, userID }): Promise<any> => {
                const itemss = await prisma.items.create({
                    data: {
                        items,
                        dosage,
                        category: {
                            connect: {
                                categoryID
                            }
                        },
                        info: {
                            create: {
                                price, expiredDate, quantity
                            }
                        }
                    }
                })


                await prisma.logs.create({
                    data: {
                        logs: "Created an Item",
                        descriptions: "You have been created new Item.",
                        User: {
                            connect: {
                                userID
                            }
                        }
                    }
                })

                pubsub.publish("createItems", itemss)
                return itemss
            }
        })

        t.field("updateMedicalitems", {
            type: "item",
            args: { items: "itemInput", itemsID: nonNull(idArg()), userID: nonNull(idArg()) },
            resolve: async (_, { items: { dosage, expiredDate, items, price, quantity }, itemsID, userID }): Promise<any> => {


                const item = await prisma.items.update({
                    data: {
                        items,
                        dosage,
                        updatedAt: new Date(Date.now()),
                        info: {
                            update: {
                                expiredDate, price, quantity
                            }
                        }
                    },
                    where: { itemsID }
                })

                await prisma.logs.create({
                    data: {
                        logs: "Updated an Item",
                        descriptions: `You updated an Item: ${item.items}`,
                        User: {
                            connect: {
                                userID
                            }
                        }
                    }
                })


                return item
            }
        })
        t.field("deleteMedicalItem", {
            type: "item",
            args: { itemsID: nonNull(idArg()), userID: nonNull(idArg()) },
            resolve: async (_, { itemsID, userID }): Promise<any> => {


                const item = await prisma.items.delete({
                    where: { itemsID }
                })

                await prisma.logs.create({
                    data: {
                        logs: "Deleted an Item",
                        descriptions: `You deleted an Item: ${item.items}`,
                        User: {
                            connect: {
                                userID
                            }
                        }
                    }
                })

                return item
            }
        })
    },
})