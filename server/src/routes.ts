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


    app.post('/new/user/company', async (request, reply) => {
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

    app.post(`/vacancy/sub`, async (request) => {
        

        const vacancySubBody = z.object({
            alunoId: z.number(),
            vacancyId: z.number(),
        })
        
        const { alunoId, vacancyId } = vacancySubBody.parse(request.body)
        

        await prisma.inscricoes_vaga.create({
            data:{
                usersId: alunoId,
                vagasId: vacancyId
            }
        })

    })

    app.post(`/vacancy/create`, async (request)=>{

        const vacancyBody = z.object({
            titulo : z.string(),
            descricao : z.string(),
            salario: z.number(),
            tipo: z.number(),
            remunerado: z.number(),
            confidencial_nome: z.number(),
            confidencial_salario: z.number(),
            status: z.number(),
            empresasUsersId: z.number(),
            data_inicio: z.string(),
            data_termino: z.string(),
        })

        const {
            confidencial_nome,
            confidencial_salario,
            data_inicio,
            data_termino,
            descricao,
            empresasUsersId,
            remunerado,
            salario,
            status,
            tipo,
            titulo
        } = vacancyBody.parse(request.body)


        await prisma.vagas.create({
            data:{
                data_inicio: new Date(data_inicio),
                data_termino: new Date(data_termino),
                titulo: titulo,
                descricao: descricao,
                empresasUsersId: empresasUsersId,
                remunerado: remunerado,
                salario: salario,
                status: status,
                tipo: tipo,
                confidencial_nome: confidencial_nome,
                confidencial_salario: confidencial_salario,
            }
        })

    })
}