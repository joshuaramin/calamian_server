import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../../../util/index.js";

export const itemQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getAllStoreItems", {
      type: "item",
      resolve: async (): Promise<any> => {
        return await prisma.items.findMany({
          where: {
            is_deleted: false,
          },
        });
      },
    });
    t.list.field("getItemBySearch", {
      type: "item",
      args: { search: stringArg(), categoryID: nonNull(idArg()) },
      resolve: async (_, { search, categoryID }): Promise<any> => {
        return await prisma.items.findMany({
          where: {
            is_deleted: false,
            category: {
              some: {
                categoryID,
              },
            },
            items: {
              contains: search,
              mode: "insensitive",
            },
          },
        });
      },
    });

    t.list.field("getItemsByStaff", {
      type: "item",
      args: { search: nonNull(stringArg()) },
      resolve: async (_, { search }): Promise<any> => {
        return await prisma.items.findMany({
          where: {
            is_deleted: false,
            items: {
              contains: search,
              mode: "insensitive",
            },
          },
        });
      },
    });

    t.list.field("getItemsById", {
      type: "item",
      args: { itemsID: nonNull(idArg()) },
      resolve: async (_, { itemsID }): Promise<any> => {
        return await prisma.items.findMany({
          where: { itemsID },
        });
      },
    });

    t.int("getTotalNoOfItems", {
      resolve: async (): Promise<any> => {
        const items = await prisma.items.findMany();

        return items.length;
      },
    });

    t.list.field("getItemsByCategoryId", {
      type: "item",
      args: { categoryID: nonNull(idArg()), search: stringArg() },
      resolve: async (_, { categoryID, search }): Promise<any> => {
        return await prisma.items.findMany({
          where: {
            is_deleted: false,
            category: {
              some: {
                categoryID,
              },
            },
            items: { contains: search, mode: "insensitive" },
          },
          orderBy: {
            info: {
              expiredDate: "asc",
            },
          },
        });
      },
    });
  },
});
