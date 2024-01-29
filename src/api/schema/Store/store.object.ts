import { objectType } from "nexus";


export const StoreObject = objectType({
    name: "store",
    definition(t) {
        t.id("storeInfoID");
        t.float("price");
        t.int("quantity");
        t.date("expiredDate");
    },
})