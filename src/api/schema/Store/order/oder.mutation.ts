import { extendType, inputObjectType, list, nonNull, stringArg } from "nexus";
import { prisma, pubsub } from "../../../../util/index.js";



export const orderInput = inputObjectType({
    name: "orderInput",
    definition(t) {
        t.id("itemsID");
        t.int("quantity");
        t.float("total");
    },
})

function makeid(length: number) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQWERTUVWXYZ1234567890';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

export const OrderMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("createAnOrder", {
            type: "order",
            args: { orders: list("orderInput") },
            resolve: async (_, { orders }): Promise<any> => {

                return prisma.$transaction(async () => {


                    const reduceTotal = orders.reduce((a, { total }) => (a + total), 0)
                    const order = await prisma.order.create({
                        data: {
                            order: `#${makeid(8)}`,
                            total: reduceTotal + (reduceTotal * 0.12),
                            createdAt: new Date(Date.now()),
                            orderList: {
                                create: orders.map(({ itemsID, quantity, total }) => {
                                    return {
                                        quantity, total,
                                        items: {
                                            connect: {
                                                itemsID
                                            }
                                        }
                                    }
                                })
                            }
                        }
                    })

                    orders.map(async ({ itemsID, quantity }) => {

                        const prod = await prisma.items.findUnique({
                            where: {
                                itemsID
                            },
                            include: {
                                info: true
                            }
                        })


                        const newlyData = await prisma.storeInfo.update({
                            data: {
                                quantity: prod.info.quantity - quantity
                            },
                            where: {
                                itemsID
                            },
                            include: {
                                items: true
                            }
                        })

                        if (newlyData.quantity < 50) {
                            await prisma.notification.create({
                                data: {
                                    notification: `Attention! ${prod.items} quantity is currently ${newlyData.quantity}. Consider reordering soon to avoid shortages.`,
                                }
                            })
                        }
                        if (newlyData.quantity <= 0) {
                            await prisma.notification.create({
                                data: {
                                    notification: `Attention! ${prod.items} is out of stock. Please contact your supplier.`
                                }
                            })
                        }

                        return order
                    })

                    pubsub.publish("createdOrders", orders)
                })

            }
        })
        t.list.field("generateOrderReport", {
            type: "order",
            args: { startDate: nonNull(stringArg()), endDate: nonNull(stringArg()) },
            resolve: async (_, { startDate, endDate }): Promise<any> => {
                return await prisma.order.findMany({
                    where: {
                        createdAt: {
                            lte: new Date(endDate),
                            gte: new Date(startDate)
                        }
                    }
                })
            }
        })
    },
})