import { objectType } from "nexus";



export const NotificationObject = objectType({
    name: "notification",
    definition(t) {
        t.id("notificationID");
        t.string("notification");
        t.string("notifStatus");
        t.datetime("createdAt");
    },
})