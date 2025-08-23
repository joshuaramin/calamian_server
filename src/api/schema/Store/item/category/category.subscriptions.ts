import { subscriptionField } from "nexus";
import { pubsub } from "../../../../../util/index.js";

export const CategorySubscriptions = subscriptionField(
  "categorySubscriptions",
  {
    type: "category",
    subscribe: async (): Promise<any> => {
      return await pubsub.asyncIterator("createCategory");
    },
    resolve: async (payload): Promise<any> => {
      return payload;
    },
  }
);
