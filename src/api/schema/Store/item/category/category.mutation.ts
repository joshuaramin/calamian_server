import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma, pubsub } from "../../../../../util/index.js";


type Category = {
    category: string
}

export const CategoryMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("createCategory", {
            type: "category",
            args: { category: nonNull(stringArg()), userID: nonNull(idArg()) },
            resolve: async (_, { category, userID }): Promise<Category> => {
                const categories = await prisma.category.create({
                    data: {
                        category
                    }
                })

                await prisma.logs.create({
                    data: {
                        logs: "Created Category",
                        descriptions: `You created a category ${categories.category}.`,
                        User: {
                            connect: {
                                userID
                            }
                        }
                    }
                })

                pubsub.publish("createCategory", categories)

                return categories
            }
        })
        t.field("updateCategory", {
            type: "category",
            args: { categoryID: nonNull(idArg()), category: nonNull(stringArg()), userID: nonNull(idArg()) },
            resolve: async (_, { categoryID, category, userID }): Promise<any> => {



                const categories = await prisma.category.update({
                    data: { category, updatedAt: new Date(Date.now()) },
                    where: {
                        categoryID
                    }
                })

                await prisma.logs.create({
                    data: {
                        logs: "Updated Category",
                        descriptions: `You updated a category to ${categories.category}.`,
                        User: {
                            connect: {
                                userID
                            }
                        }
                    }
                })

                return categories
            }
        })
        t.field("deleteCategory", {
            type: "category",
            args: { categoryID: nonNull(idArg()), userID: nonNull(idArg()) },
            resolve: async (_, { categoryID, userID }): Promise<any> => {
                const categories = await prisma.category.delete({
                    where: {
                        categoryID
                    }
                })


                await prisma.logs.create({
                    data: {
                        logs: "Deleted Category",
                        descriptions: `You deleted a Category ${categories.category}.`,
                        User: {
                            connect: {
                                userID
                            }
                        }
                    }
                })

                return categories
            }
        })
    },
})