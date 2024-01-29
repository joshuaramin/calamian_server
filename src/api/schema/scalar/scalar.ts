import { GraphQLDate, GraphQLDateTime, GraphQLEmailAddress, GraphQLPhoneNumber } from 'graphql-scalars'
import { asNexusMethod } from 'nexus'



export const email = asNexusMethod(GraphQLEmailAddress, "email");
export const phone = asNexusMethod(GraphQLPhoneNumber, "phone");
export const datetime = asNexusMethod(GraphQLDateTime, "datetime");
export const date = asNexusMethod(GraphQLDate, "date");