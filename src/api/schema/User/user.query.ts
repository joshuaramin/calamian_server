import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../../util/index.js";
import { Prisma, User } from "@prisma/client";
export const UserQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getAllUserAccount", {
      type: "user",
      args: { search: stringArg(), role: "role" },
      resolve: async (_, { search, role }): Promise<any> => {
        let where: Prisma.UserWhereInput = {
          is_deleted: false,
          ...(search && {
            OR: [
              {
                email: { contains: search, mode: "insensitive" },
              },
              {
                Profile: {
                  OR: [
                    { firstname: { contains: search, mode: "insensitive" } },
                    { lastname: { contains: search, mode: "insensitive" } },
                  ],
                },
              },
            ],
          }),
        };
        return await prisma.user.findMany({
          where,
          orderBy: {
            role: "asc",
          },
        });
      },
    });
    t.list.field("getAllUserAccountManagerRole", {
      type: "user",
      resolve: async (): Promise<any> => {
        return await prisma.user.findMany({
          where: {
            is_deleted: false,
            NOT: {
              role: "admin",
            },
          },
          orderBy: {
            role: "asc",
          },
        });
      },
    });
    t.list.field("getUserById", {
      type: "user",
      args: { userID: nonNull(idArg()) },
      resolve: async (_, { userID }): Promise<any> => {
        return await prisma.user.findMany({
          where: { userID },
        });
      },
    });
    t.list.field("getSearchByUser", {
      type: "user",
      args: { search: nonNull(stringArg()) },
      resolve: async (_, { search }): Promise<any> => {
        return await prisma.user.findMany({
          where: {
            is_deleted: false,
            Profile: {
              firstname: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        });
      },
    });
  },
});
