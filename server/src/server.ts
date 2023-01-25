import Fastify from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    log: ['query'],
})

async function bootstrap() {
    const fastify = Fastify({
        logger: true,
    })

    await fastify.register(cors, {
        origin: true, //Colocar o dominio ex.: www.etecbayeux.com.br
    })

    fastify.get('/vacancies', async () => {
        const vacancies = await prisma.vagas.findMany()

        return { vacancies }
    })


    await fastify.listen({ port: 3107 })
}

bootstrap()