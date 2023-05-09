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
    
    app.get('/cursos/tecnico', async()=>{
        const curso = await prisma.cursos_tecnicos.findMany()

        return { curso }
    })
    app.get('/cursos/medio', async()=>{
        const curso = await prisma.cursos_ensino_medio.findMany()

        return { curso }
    })

    app.post('/new/user/employee', async(request, reply) => {
        const createUserBody = z.object({
            senha: z.string(),
            tipo: z.number(),
            cpf: z.string(),
            celular: z.string().nullable(),
            email: z.string(),
            nome: z.string(),
            status: z.number()

        })

        const { senha, tipo, cpf, celular, email, nome, status} = createUserBody.parse(request.body)
        
        const newEmployee = await prisma.users.create({
            data:{
                senha: senha,
                tipo: tipo,
                Funcionarios: {
                    create: {
                        cpf: cpf,
                        email: email,
                        nome: nome,
                        celular: celular,
                        status: status,
                    }
                }
            }
        })
        return reply.status(201).send({ newEmployee })
    })

    app.post('/new/user/student', async(request, reply) => {

        const createStudentBody = z.object({
            senha: z.string(),
            tipo: z.number(),
            cpf: z.string(),
            celular: z.string().nullable(),
            email: z.string().email(),
            nome: z.string(),
            data_nascimento: z.coerce.date(),
            rm: z.number().min(1).max(7),
            ensinoMedio: z.number().nullable(),
            cursoTecnico: z.number().nullable(),
            telefone: z.string().nullable(),
            status: z.number(),
        });

        const { senha, tipo, cpf, celular, email, nome, data_nascimento, rm,
            ensinoMedio, cursoTecnico, telefone, status } = createStudentBody.parse(request.body)
            
        const isoDate = data_nascimento
        const today = dayjs().startOf('day').toDate()

        const newStudent = await prisma.users.create({
            data:{
                senha: senha,
                tipo: tipo,
                created_At:today,
                updated_At:today,
                Alunos: {
                    create:{
                        cpf: cpf,
                        data_nascimento: isoDate,
                        email: email,
                        nome: nome,
                        rm: rm,
                        celular: celular, 
                        status: status,
                        curso_ensino_medio_Id: ensinoMedio,
                        curso_tecnico_Id: cursoTecnico,
                        telefone: telefone,
                    }
                }
            }
        })

        return reply.status(201).send({ newStudent })
    })


    app.post('/new/user/company', async (request, reply) => {
        const newCompanyBody = z.object({
            senha: z.string(),
            tipo: z.number(),
            cnpj: z.string(),
            nome: z.string(),
            email: z.string(),
            telefone: z.string().nullable(),
            celular: z.string().nullable(),
            status: z.number()
        })

        console.log(request.body)

        const {celular, cnpj, email, nome, senha, telefone, tipo, status } = newCompanyBody.parse(request.body)

        const newCompany = await prisma.users.create({
            data:{
                senha: senha,
                tipo: tipo,
                Empresas:{
                    create:{
                        cnpj: cnpj,
                        nome_fantasia: nome,
                        celular: celular,
                        email: email,
                        status: status,
                        telefone: telefone,
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