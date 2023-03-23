import Fastify from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
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
        const vacancies = await prisma.vagas.findMany({
            include: {
                Empresas: {
                    select:{
                        celular: true,
                        cnpj: true,
                        email: true,
                        nome_fantasia: true,
                        status: true,
                        telefone: true,
                        user: true,
                        usersId: true,
                        vagasCriadas: true
                    }
                },
                inscricoes_vaga: {
                    select:{
                        created_At: true,
                        updated_At: true,
                        id: true,
                        user: true,
                        usersId: true,
                        vagas: true,
                        vagasId: true
                    }
                }
            }
        })

        return { vacancies }
    })

    fastify.post('/new/user/employee', async(request, reply) => {
        const createUserBody = z.object({
            password: z.string(),
            type: z.number(),
            cpf: z.string(),
            cellphone: z.string().nullable(),
            email: z.string(),
            name: z.string(),

        })

        const { password, type, cpf, cellphone, email, name } = createUserBody.parse(request.body)
        
        const newEmployee = await prisma.users.create({
            data:{
                senha: password,
                tipo: type,
                Funcionarios: {
                    create: {
                        cpf: cpf,
                        email: email,
                        nome: name,
                        celular: cellphone,
                        status: 0,
                    }
                }
            }
        })
        return reply.status(201).send({ newEmployee })
    })

    fastify.post('/new/user/student', async(request, reply) => {

        const createStudentBody = z.object({
            password: z.string(),
            type: z.number(),
            cpf: z.string(),
            cellphone: z.string().nullable(),
            email: z.string(),
            name: z.string(),
            birthDate: z.date(),
            rm: z.number(),
            highSchool: z.number().nullable(),
            technicalCourse: z.number().nullable(),
            phone: z.string().nullable() 
        })
        const { password, type, cpf, cellphone, email, name, birthDate, rm,
             highSchool, technicalCourse, phone } = createStudentBody.parse(request.body)

        const newStudent = await prisma.users.create({
            data:{
                senha: password,
                tipo: type,
                Alunos: {
                    create:{
                        cpf: cpf,
                        data_nascimento: birthDate,
                        email: email,
                        nome: name,
                        rm: rm,
                        celular: cellphone, 
                        status: 0,
                        curso_ensino_medio_Id: highSchool,
                        curso_tecnico_Id: technicalCourse,
                        telefone: phone,
                    }
                }
            }
        })

        return reply.status(201).send({ newStudent })
        
    })

    fastify.post('/new/user/company', async (request, reply) => {
        const newCompanyBody = z.object({
            password: z.string(),
            type: z.number(),
            cnpj: z.string(),
            name: z.string(),
            email: z.string(),
            phone: z.string().nullable(),
            cellphone: z.string().nullable(),
        })

        const {cellphone, cnpj, email, name, password, phone, type } = newCompanyBody.parse(request.body)

        const newCompany = await prisma.users.create({
            data:{
                senha: password,
                tipo: type,
                Empresas:{
                    create:{
                        cnpj: cnpj,
                        nome_fantasia: name,
                        celular: cellphone,
                        email: email,
                        status: 0,
                        telefone: phone,
                    }
                }
            }
        })

        return reply.status(201).send({ newCompany })
    })


    await fastify.listen({ port: 3107 })
}

bootstrap()