import fastify from "fastify";
import cors from '@fastify/cors'
import { appRoute } from "./routes";
import { PrismaClient } from "@prisma/client";

const app = fastify()

app.register(cors)
/**
 * Método HTTP: Get, Post, Put, Patch, Delete
 */
app.register(appRoute)


app.listen({
    port: 3107,
    host: '0.0.0.0'
}).then(()=> {
    new PrismaClient({
        log: ['query']
    })
})

