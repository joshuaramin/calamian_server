import { objectType } from "nexus";



export const ExpensesObject = objectType({
    name: "expenses",
    definition(t) {
        t.id("expenseID");
        t.string("expense");
        t.float("amount");
        t.string("mod");
        t.date("payDate");
        t.datetime("createdAt");
    },
})