import { extendType } from "nexus";
import { prisma } from "../../../util/index.js";



export const notificationQuery = extendType({
    type: "Query",
    definition(t) {
        t.list.field("getAllNotification", {
            type: "notification",
            resolve: async (): Promise<any> => {
                return await prisma.notification.findMany({
                    orderBy: {
                        createdAt: "desc"
                    }
                })
            }
        })
        t.list.field("getAllUnreadNotification", {
            type: "notification",
            resolve: async (): Promise<any> => {
                return await prisma.notification.findMany({
                    where: {
                        notifStatus: "unread"
                    },
                    orderBy: {
                        createdAt: "desc"
                    }
                })
            }
        })
    },
})