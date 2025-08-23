import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../../util/index.js";
import { string } from "zod";

export const expFolderQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getAllExpenseFolder", {
      type: "expenseFolder",
      args: { search: stringArg() },
      resolve: async (_, { search }): Promise<any> => {
        return await prisma.expFolder.findMany({
          where: {
            is_deleted: false,
            exFolder: {
              contains: search,
              mode: "insensitive",
            },
          },
        });
      },
    });

    t.list.field("getExpenseFolderById", {
      type: "expenseFolder",
      args: { expFolderID: nonNull(idArg()) },
      resolve: async (_, { expFolderID }): Promise<any> => {
        return await prisma.expFolder.findMany({
          where: {
            expFolderID,
          },
        });
      },
    });
  },
});
