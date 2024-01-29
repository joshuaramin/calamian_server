import { objectType } from "nexus";




export const LogsObject = objectType({
    name: "logs",
    definition(t) {
        t.id('logsID');
        t.string("logs");
        t.string("descriptions");
        t.datetime("createdAt");
    },
})