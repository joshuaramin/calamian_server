import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../../../util/index.js";
import { GraphQLError } from "graphql";


export const ProfileMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("updateUserProfile", {
            type: "profile",
            args: { userID: nonNull(idArg()), firstname: nonNull(stringArg()), lastname: nonNull(stringArg()), phone: nonNull("PhoneNumber"), birthday: nonNull("Date") },
            resolve: async (_, { userID, firstname, lastname, phone, birthday }): Promise<any> => {
                if (!firstname || !lastname || !phone || !birthday)
                    throw new GraphQLError("Fields should not be empty")
                return await prisma.profile.update({
                    data: {
                        firstname, lastname, phone, birthday,
                    },
                    where: {
                        userID
                    }
                })
            }
        })
    },
})