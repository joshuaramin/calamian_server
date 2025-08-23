import { unionType } from "nexus";

export const UserPayload = unionType({
  name: "UserPaylaod",
  definition(t) {
    t.members("user", "ErrorObject");
  },
});

export const AuthPayload = unionType({
  name: "AuthPayload",
  definition(t) {
    t.members("token", "ErrorObject");
  },
});
