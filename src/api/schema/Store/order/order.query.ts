import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../../../util/index.js";
import { GraphQLError } from "graphql";
import { format } from "date-fns";

export const OrderQUery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getAllOrders", {
      type: "order",
      resolve: async (): Promise<any> => {
        return await prisma.order.findMany();
      },
    });
    t.field("getTotal", {
      type: "total",
      resolve: async (): Promise<any> => {
        const totalRevenue = (await prisma.order.findMany()).reduce(
          (a, b) => a + b.total,
          0
        );

        const totalOrders = await prisma.order.count();

        const totalItems = await prisma.items.count();

        return {
          totalRevenue,
          totalOrders,
          totalItems
        };
      },
    });
    t.list.field("getCurrentOrdersBy20", {
      type: "order",
      resolve: async (): Promise<any> => {
        return await prisma.order.findMany({
          take: 20,
          orderBy: {
            createdAt: "desc",
          },
        });
      },
    });
    t.float("getTotalRevenue", {
      resolve: async (): Promise<any> => {
        const orders = await prisma.order.findMany();

        return orders.reduce((a, b) => a + b.total, 0);
      },
    });
    t.int("getTotalNoOfOrders", {
      resolve: async (): Promise<any> => {
        const orders = await prisma.order.findMany();
        return orders.length;
      },
    });
    t.list.field("getAllOrderHistory", {
      type: "OrderTotal",
      args: { dmy: nonNull(stringArg()) },
      resolve: async (_, { dmy }): Promise<any> => {
        switch (dmy) {
          case "Weekly":
            const weekly = (await prisma.$queryRawUnsafe(`SELECT
                        DATE(DATE_TRUNC('week', "createdAt")) AS period,
                        COUNT(*) AS record_count
                        FROM
                            "Order"
                        GROUP BY
                            DATE(DATE_TRUNC('week', "createdAt"))
                        ORDER BY
                            period;
                    `)) as any;

            return weekly.map(({ period, record_count }) => {
              return {
                date: format(new Date(period), "MMMM dd, yyyy"),
                total: parseInt(record_count),
              };
            });
          case "Monthly":
            const monthly = (await prisma.$queryRawUnsafe(`SELECT
                        EXTRACT(MONTH FROM "createdAt") AS period,
                        COUNT(*) record_count
                    FROM
                         "Order"
                    GROUP BY
                        EXTRACT(MONTH FROM "createdAt")
                    ORDER BY
                        period;
                    `)) as any;

            return monthly.map(({ period, record_count }) => {
              return {
                date: format(new Date(period), "MMMM"),
                total: parseInt(record_count),
              };
            });
          case "Yearly":
            const yearly = (await prisma.$queryRawUnsafe(`SELECT
                        EXTRACT(YEAR FROM "createdAt") AS period,
                        COUNT(*) record_count
                    FROM
                      "Order"
                    GROUP BY
                        EXTRACT(YEAR FROM "createdAt")
                    ORDER BY
                        period;`)) as any;

            return yearly.map(({ period, record_count }) => {
              return {
                date: format(new Date(period), "yyyy"),
                total: parseInt(record_count),
              };
            });
          default:
            throw new GraphQLError(
              "Please selecet on the given enum, Weekly, Monthly, and Yearly"
            );
        }
      },
    });
    t.list.field("getOrderById", {
      type: "order",
      args: { orderID: nonNull(idArg()) },
      resolve: async (_, { orderID }): Promise<any> => {
        return await prisma.order.findMany({
          where: {
            orderID,
          },
        });
      },
    });
  },
});
