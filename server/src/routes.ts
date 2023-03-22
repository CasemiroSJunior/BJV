import { FastifyInstance } from "fastify"
import { prisma } from "./lib/prisma"
import { z } from 'zod'
import dayjs from 'dayjs'

export async function appRoute(app: FastifyInstance){
    app.get('/vacancies', async () => {
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

    app.post('/new/user/employee', async(request, reply) => {
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

    app.post('/new/user/student', async(request, reply) => {

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
            
        const isoDate = dayjs(birthDate).toISOString()

        const newStudent = await prisma.users.create({
            data:{
                senha: password,
                tipo: type,
                Alunos: {
                    create:{
                        cpf: cpf,
                        data_nascimento: isoDate,
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

}