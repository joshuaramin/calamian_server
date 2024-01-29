import { enumType, extendType, idArg, nonNull } from "nexus";
import { prisma, pubsub } from "../../../util/index.js";

export const ArchiveTab = enumType({
    name: "tab",
    members: [ "user", "expFolder", "item", "category" ]
})


export const ArchiveMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("createUserArchive", {
            type: "archive",
            args: { userID: nonNull(idArg()), mainUser: nonNull(idArg()) },
            resolve: async (_, { userID, mainUser }): Promise<any> => {
                const archive = await prisma.archive.create({
                    data: {
                        archive: true,
                        tab: "user",
                        User: {
                            connect: {
                                userID
                            }
                        }
                    },
                    include: {
                        User: {
                            include: {
                                Profile: true
                            }
                        }
                    }
                })


                await prisma.logs.create({
                    data: {
                        logs: "Created an Archive User",
                        descriptions: `You archive a user ${archive.User.Profile.firstname} ${archive.User.Profile.lastname}`,
                        User: {
                            connect: {
                                userID: mainUser
                            }
                        }
                    }
                })

                pubsub.publish("createArchive", archive);
                return archive;
            }
        })

        t.field("createExpenseFolderArchive", {
            type: "archive",
            args: { expFolderID: nonNull(idArg()), userID: nonNull(idArg()) },
            resolve: async (_, { expFolderID, userID }): Promise<any> => {
                const archive = await prisma.archive.create({
                    data: {
                        archive: true,
                        tab: "expFolder",
                        expFolderID
                    },
                    include: {
                        expFolder: true
                    }
                })

                await prisma.logs.create({
                    data: {
                        logs: "Created an Archive Expense Folder",
                        descriptions: `You archive a Expense Folder ${archive.expFolder.exFolder}`,
                        User: {
                            connect: {
                                userID
                            }
                        }
                    }
                })
                pubsub.publish("createArchive", archive)
                return archive;
            }
        })
        t.field("createCategoryArchive", {
            type: "archive",
            args: { categoryID: nonNull(idArg()), userID: nonNull(idArg()) },
            resolve: async (_, { categoryID, userID }): Promise<any> => {
                const archive = await prisma.archive.create({
                    data: {
                        archive: true,
                        tab: "category",
                        category: {
                            connect: {
                                categoryID
                            }
                        }
                    },
                    include: {
                        category: true
                    }
                })

                await prisma.logs.create({
                    data: {
                        logs: "Created an Archive Category",
                        descriptions: `You archive an Category ${archive.category.category}`,
                        User: {
                            connect: {
                                userID
                            }
                        }
                    }
                })
                pubsub.publish("createArchive", archive)
                return archive;
            }
        })
        t.field("createItemArchive", {
            type: "archive",
            args: { itemsID: nonNull(idArg()), userID: nonNull(idArg()) },
            resolve: async (_, { itemsID, userID }): Promise<any> => {
                const archive = await prisma.archive.create({
                    data: {
                        archive: true,
                        tab: "item",
                        items: {
                            connect: {
                                itemsID
                            }
                        }
                    },
                    include: {
                        items: true
                    }
                })

                await prisma.logs.create({
                    data: {
                        logs: "Created an Archive Items",
                        descriptions: `You archive an Item ${archive.items.items}`,
                        User: {
                            connect: {
                                userID
                            }
                        }
                    }
                })
                pubsub.publish("createArchive", archive)
                return archive;
            }
        })
        t.field("updateArchive", {
            type: "archive",
            args: { archiveID: nonNull(idArg()), userID: nonNull(idArg()) },
            resolve: async (_, { archiveID, userID }): Promise<any> => {
                const users = await prisma.archive.update({
                    data: {
                        archive: false
                    },
                    where: {
                        archiveID
                    }
                })
                await prisma.archive.delete({
                    where: {
                        archiveID
                    }
                })

                await prisma.logs.create({
                    data: {
                        logs: "Updated an Archive",
                        descriptions: `You updated an archive items`,
                        User: {
                            connect: {
                                userID
                            }
                        }
                    }
                })
                return users
            }
        })
    },
})