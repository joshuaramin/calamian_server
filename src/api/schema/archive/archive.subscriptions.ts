import { subscriptionField } from "nexus";
import { pubsub } from "../../../util/index.js";



interface Archive {
    archiveID: string
    archive: boolean,
    tab: "user" | "item" | "expFolder" | "category"
}

export const ArchiveSubscriptions = subscriptionField("archiveSubscriptions", {
    type: "archive",
    args: { tab: "tab" },
    subscribe: async (): Promise<any> => {
        return await pubsub.asyncIterator("createArchive")
    },
    resolve: async (payload: Archive, { tab }): Promise<Archive> => {
        if (payload.tab === tab) {
            return payload
        }
    }
})