import { objectType } from "nexus";
import { prisma } from "../../../../util/index.js";

export const TotalRevenue = objectType({
  name: "total",
  definition(t) {
    t.float("totalRevenue");
    t.int("totalOrders");
    t.int("totalItems");
  },
});

export const orderObject = objectType({
  name: "order",
  definition(t) {
    t.id("orderID");
    t.string("order");
    t.float("total");
    t.datetime("createdAt");
    t.int("itemCount", {
      resolve: async ({ orderID }): Promise<any> => {
        return await prisma.orederListitem.count({
          where: {
            orderID,
          },
        });
      },
    });
    t.list.field("orderCart", {
      type: "orderCart",
      resolve: async ({ orderID }): Promise<any> => {
        return await prisma.orederListitem.findMany({
          where: {
            orderID,
          },
        });
      },
    });
  },
});

export const orderHistory = objectType({
  name: "OrderTotal",
  definition(t) {
    t.string("date");
    t.int("total");
  },
});
