import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../../../../util/index.js";

export const CategoryQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getAllCategory", {
      type: "category",
      args: { search: stringArg() },
      resolve: async (_, { search }): Promise<any> => {
        return await prisma.category.findMany({
          where: {
            is_deleted: false,
            category: {
              contains: search,
              mode: "insensitive",
            },
          },
        });
      },
    });
    t.list.field("getCategotiesById", {
      type: "category",
      args: { categoryID: nonNull(idArg()) },
      resolve: async (_, { categoryID }): Promise<any> => {
        return await prisma.category.findMany({
          where: {
            categoryID,
          },
        });
      },
    });
  },
});
