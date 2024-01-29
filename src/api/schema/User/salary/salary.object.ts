import { objectType } from "nexus";



export const SalaryObject = objectType({
    name: "salary",
    definition(t) {
        t.id("salaryID");
        t.float('salary');
        t.datetime("createdAt");
        t.datetime("updatedAt");
    },
})