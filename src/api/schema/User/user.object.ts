import { objectType } from "nexus";
import { prisma } from "../../../util/index.js";

export const UserObject = objectType({
  name: "user",
  definition(t) {
    t.id("userID");
    t.email("email");
    t.string("password");
    t.string("role");
    t.float("salary");
    t.datetime("createdAt");
    t.datetime("updatedAt");
    t.field("myProfile", {
      type: "profile",
      resolve: async ({ userID }): Promise<any> => {
        return await prisma.profile.findFirst({
          where: {
            userID,
          },
        });
      },
    });
    t.field("salary", {
      type: "salary",
      resolve: async ({ userID }): Promise<any> => {
        return await prisma.salary.findFirst({
          where: {
            userID,
          },
        });
      },
    });
    t.list.field("logs", {
      type: "logs",
      resolve: async ({ userID }): Promise<any> => {
        return await prisma.logs.findMany({
          where: {
            userID,
          },
        });
      },
    });
  },
});

export const TokenObject = objectType({
  name: "token",
  definition(t) {
    t.field("user", {
      type: "user",
    }),
      t.string("token");
  },
});
