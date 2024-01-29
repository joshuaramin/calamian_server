import { enumType, extendType, idArg, inputObjectType, nonNull, stringArg } from "nexus";
import { prisma, pubsub } from "../../../util/index.js";
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { GraphQLError } from "graphql";


const { sign } = jsonwebtoken

export const UserEnum = enumType({
    name: "role",
    members: [ "admin", "manager", "staff" ]
})


export const UserInput = inputObjectType({
    name: "userInput",
    definition(t) {
        t.email("email");
        t.string("firstname");
        t.string("lastname");
        t.phone("phone");
        t.date("birthday");
        t.float("salary");
    },
})

type User = {
    email: string
    password: string

}

export const UserMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("createUserAccount", {
            type: "user",
            args: { user: "userInput", role: nonNull("role") },
            resolve: async (_, { user: { email, birthday, firstname, lastname, phone, salary }, role }): Promise<User> => {

                const pass = await bcrypt.hash(new Date(birthday).toISOString().slice(0, 10).replaceAll("-", ""), 12);

                const users = await prisma.user.create({
                    data: {
                        email,
                        password: pass,
                        role,
                        Profile: {
                            create: {
                                firstname, lastname, birthday, phone
                            }
                        },
                        salary: {
                            create: {
                                salary
                            }
                        }
                    }
                })

                pubsub.publish("createUser", users)
                return users
            }
        })
        t.field("deleteUserAccount", {
            type: "user",
            args: { userID: nonNull(idArg()), main: nonNull(idArg()) },
            resolve: async (_, { userID, main }): Promise<any> => {


                const user = await prisma.user.delete({
                    where: {
                        userID
                    }
                })

                await prisma.logs.create({
                    data: {
                        logs: "Deleted Account",
                        descriptions: "You delete an User Account",
                        User: {
                            connect: {
                                userID: main
                            }
                        }
                    }
                })

                return user
            }
        })
        t.field("login", {
            type: "token",
            args: { email: nonNull("EmailAddress"), password: nonNull(stringArg()) },
            resolve: async (_, { email, password }, { res }): Promise<any> => {


                const user = await prisma.user.findUnique({
                    where: {
                        email
                    },
                })


                if (!user) throw new GraphQLError("Email Address is not found");

                const valid = await bcrypt.compare(password, user.password);

                if (!valid) throw new GraphQLError("Password is mismatch");


                const token = sign({ userId: user.userID, role: user.role }, "pharmaceutical", {
                    algorithm: "HS256",
                    expiresIn: 60 * 60 * 24 * 1000
                })

                res.cookie("pha-tkn", token);

                await prisma.logs.create({
                    data: {
                        logs: "Logged In",
                        descriptions: "",
                        User: {
                            connect: {
                                userID: user.userID
                            }
                        }
                    }
                })

                return {
                    token
                }
            }
        })
        t.field("resetUserPasswordToDefault", {
            type: "user",
            args: { userID: nonNull(idArg()) },
            resolve: async (_, { userID }): Promise<any> => {

                const usersProfile = await prisma.profile.findUnique({
                    where: {
                        userID
                    },
                })

                const pass = await bcrypt.hash(new Date(usersProfile.birthday).toISOString().slice(0, 10).replaceAll("-", ""), 12);

                await prisma.logs.create({
                    data: {
                        logs: "Reset Password",
                        descriptions: "Your password has been reset to default",
                        User: {
                            connect: {
                                userID: usersProfile.userID
                            }
                        }
                    },
                })
                return await prisma.user.update({
                    data: {
                        password: pass, updatedAt: new Date(Date.now())
                    },
                    where: { userID }
                })
            }
        })

        t.field("updateUserAccounts", {
            type: "user",
            args: { userID: nonNull(idArg()), user: "userInput" },
            resolve: async (_, { userID, user: { email, birthday, firstname, lastname, phone, salary } }): Promise<any> => {


                await prisma.logs.create({
                    data: {
                        logs: "Updated Account",
                        descriptions: "You updated your account details",
                        User: {
                            connect: {
                                userID
                            }
                        }
                    }
                })
                return await prisma.user.update({
                    data: {
                        email,
                        Profile: {
                            update: {
                                birthday,
                                firstname,
                                lastname,
                                phone
                            },
                        },
                        salary: {
                            update: {
                                salary
                            }
                        },
                        updatedAt: new Date(Date.now())
                    },
                    where: {
                        userID
                    }
                })
            }
        })
        t.field("updateUserEmailAddress", {
            type: "user",
            args: { email: nonNull("EmailAddress"), userID: nonNull(idArg()) },
            resolve: async (_, { userID, email }): Promise<any> => {

                await prisma.logs.create({
                    data: {
                        logs: "Email Address Updated",
                        descriptions: "You updated your email address",
                        User: {
                            connect: {
                                userID
                            }
                        }
                    }
                })
                return await prisma.user.update({
                    where: { userID },
                    data: { email }
                })
            }
        })
        t.field("updateUserPassword", {
            type: "user",
            args: { userID: nonNull(idArg()), currentPasword: nonNull(stringArg()), password: nonNull(stringArg()), retype: nonNull(stringArg()) },

            resolve: async (_, { userID, password, retype, currentPasword }): Promise<any> => {


                if (password !== retype) throw new GraphQLError("Password is not the same. Retype it again")
                const pass = await bcrypt.hash(password, 12)

                await prisma.logs.create({
                    data: {
                        logs: "Changed Password",
                        descriptions: "You updated your password",
                        User: {
                            connect: {
                                userID
                            }
                        }
                    }
                })

                const users = await prisma.user.findUnique({
                    where: {
                        userID
                    }
                })


                const validPassword = await bcrypt.compare(currentPasword, users.password);
                if (!validPassword) throw new GraphQLError("Password is not match");

                return await prisma.user.update({
                    data: {
                        password: pass,
                        updatedAt: new Date(Date.now())
                    },
                    where: {
                        userID
                    }
                })
            }
        })
    },
})