import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../../util/index.js";

export const notificationMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("createNotificationSystem", {
            type: "notification",
            resolve: async (): Promise<any> => {
                return await prisma.notification.create({
                    data: {
                        notification: '',
                    }
                })
            }
        })
        t.field("updateNotificationSystem", {
            type: "notification",
            args: { notificationID: nonNull(idArg()) },
            resolve: async (_, { notificationID }): Promise<any> => {
                return await prisma.notification.update({
                    where: {
                        notificationID
                    },
                    data: {
                        notifStatus: "read"
                    }
                })
            }
        })
    },
})