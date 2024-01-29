import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import Nexus from 'nexus'
import { createServer } from "node:http"
import { join } from 'node:path'
import { expressMiddleware } from '@apollo/server/express4';
import { useServer } from 'graphql-ws/lib/use/ws'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import { WebSocketServer } from 'ws';


dotenv.config();
const { json } = bodyParser;

import * as Scalar from './api/schema/scalar/scalar.js'
import * as Store from './api/schema/Store/store.js'
import * as User from './api/schema/User/user.js'
import * as Expense from './api/schema/expenseFolder/expense.js'
import * as Notification from './api/schema/Notification/notification.js'
import * as Archive from './api/schema/archive/archive.js'
const { makeSchema, declarativeWrappingPlugin } = Nexus;


(async function MedicalApollo() {


    const app = express()


    const httpServer = createServer(app)


    const schema = makeSchema({
        types: [ Scalar, Store, User, Expense, Notification, Archive ],
        outputs: {
            schema: join(process.cwd(), "/src/api/generated/schema.graphql"),
            typegen: join(process.cwd(), "/src/api/generated/schema.ts")
        },
        plugins: [ declarativeWrappingPlugin() ],

    })

    app.use(cookieParser())

    const wsServer = new WebSocketServer({
        path: "/graphql",
        server: httpServer
    })

    const serverCleanup = useServer({ schema }, wsServer)

    const server = new ApolloServer({
        schema,
        csrfPrevention: true,
        cache: "bounded",
        introspection: true,
        plugins: [ ApolloServerPluginLandingPageLocalDefault(), ApolloServerPluginDrainHttpServer({ httpServer }), {
            async serverWillStart() {
                return {
                    async drainServer() {
                        serverCleanup.dispose()

                    },
                }
            }
        } ]
    })

    await server.start()


    app.use("/graphql", cors<cors.CorsRequest>({
        credentials: true,
        origin: [ "https://studio.apollographql.com", "http://localhost:3000", ]
    }), json(), expressMiddleware(server, {
        context: async ({ req, res }) => ({ req, res })
    }))

    await new Promise(() => {
        httpServer.listen({ port: process.env.PORT || 4000 })
        console.log(`Server is running at port 4000 🚀 `)
    })
})()