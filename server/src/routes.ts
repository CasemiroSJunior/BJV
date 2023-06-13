import { FastifyInstance, FastifyRequest } from "fastify"
import { prisma } from "./lib/prisma"
import { z } from 'zod'
import dayjs from 'dayjs'

interface GetUsersParams {
    tipo: number;
    nome: string;
    status: number;
    cursoTecnico: number;
    ensinoMedio: number;
}

interface GetVacancyParams {
    vacancyId: number;
    userId: number;
}

export async function appRoute(app: FastifyInstance){
    app.get('/vacancies', async () => {
        const vacancies = await prisma.vagas.findMany({
            include: {
                Empresas: {
                    select:{
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

    app.get('/vacancy/userId/:userId/vacancyId/:vacancyId', async(request: FastifyRequest<{ Params: GetVacancyParams }>, reply)=>{
        const paramsBody = z.object({
            userId: z.number().nullable(),
            vacancyId: z.number().nullable()

        })

        const convertedValues = { 
            userId: request.params.userId ? Number(request.params.userId) : null,
            vacancyId: request.params.vacancyId ? Number(request.params.vacancyId) : null
        }

        const { userId, vacancyId } = paramsBody.parse(convertedValues);

        let conditions = {}

        if (userId !== null && vacancyId !== null){
            conditions = {
                where: {
                id: vacancyId,
                empresasUsersId: userId
                },
                include:{
                    Empresas: {
                        select:{
                            usersId: true,
                        }
                    }
                }
            }
        }

        const vacancyInfo = await prisma.vagas.findMany(conditions)

        return reply.status(200).send({vacancyInfo})
        }
    )

    app.put('/vacancy/update/userId/:userId/vacancyId/:vacancyId', async(request: FastifyRequest<{ Params: GetVacancyParams }>, reply)=>{
        const paramsBody = z.object({
            userId: z.number(),
            vacancyId: z.number()

        })

        const convertedValues = { 
            userId:  Number(request.params.userId),
            vacancyId: Number(request.params.vacancyId),
        }

        const { userId, vacancyId } = paramsBody.parse(convertedValues);

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


        await prisma.vagas.update({
            where:{id:vacancyId}, 
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

    app.get('/users/type/:tipo/name/:nome/status/:status/technical/:cursoTecnico/highschool/:ensinoMedio', async (request: FastifyRequest<{ Params: GetUsersParams }>, reply) => {
        const paramsBody = z.object({
          tipo: z.number().nullable().default(null),
          nome: z.string(),
          status: z.number(),
          cursoTecnico: z.number().nullable(),
          ensinoMedio: z.number().nullable(),
        });
      
        const convertedValues = {
          tipo: request.params.tipo ? Number(request.params.tipo) : null,
          status: Number(request.params.status),
          cursoTecnico: request.params.cursoTecnico ? Number(request.params.cursoTecnico) : null,
          ensinoMedio: request.params.ensinoMedio ? Number(request.params.ensinoMedio) : null,
          nome: request.params.nome,
        };
      
        const { cursoTecnico, ensinoMedio, nome, status, tipo } = paramsBody.parse(convertedValues);
      
        const conditions: any = {
          include: {
            Empresas: true,
            Alunos: true,
            Funcionarios: true,
          },
          where: {},
        };
      
        if (nome !== "") conditions.where={nome: { contains: nome }}

        if (tipo !== null && !isNaN(tipo) && tipo >= 0 && tipo <= 3) {
          conditions.where.tipo = tipo;
        }
      
        if (status) {
          conditions.where.status = status;
        }
      
        if (tipo === 1) {
          conditions.include.Alunos = {
            where: {
              curso_tecnico_Id: cursoTecnico || undefined,
              curso_ensino_medio_Id: ensinoMedio || undefined,
            },
          };
        }
      
        const userList = await prisma.users.findMany(conditions);
        return reply.status(200).send({ userList });
    });

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
                email: email,
                nome: nome,
                celular: celular,
                status: status,
                Funcionarios: {
                    create: {
                        cpf: cpf,
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
            rm: z.number(),
            ensinoMedio: z.string().nullable(),
            cursoTecnico: z.string().nullable(),
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
                email: email,
                nome: nome,
                celular: celular,
                status: status,
                Alunos: {
                    create:{
                        cpf: cpf,
                        data_nascimento: isoDate,
                        rm: rm,
                        curso_ensino_medio_Id: ensinoMedio === ""? null : Number(ensinoMedio) ,
                        curso_tecnico_Id: cursoTecnico === ""? null : Number(cursoTecnico),
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
                celular: celular,
                email: email,
                nome: nome,
                status: status,
                Empresas:{
                    create:{
                        cnpj: cnpj,
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

    app.get(`/users/getInfo/:userId`,async(request: FastifyRequest<{ Params: {userId: number} }>, reply)=>{

        const id = z.number().parse(Number(request.params.userId))
        
        const userData = await prisma.users.findUnique({
            where: {id: id},
            include:{
                Alunos: true,
                Empresas: true,
                Funcionarios: true,
            }
        })

        return reply.status(200).send(userData)
    })

    app.delete(`/user/delete/:userId`,async(request: FastifyRequest<{ Params: {userId: number} }>, reply)=>{
        const id = z.number().parse(Number(request.params.userId))
        
        try{
            const userData = await prisma.users.findUnique({
                where: {id: id},
            })
            console.log(userData)
            if(userData){
                try{
                    await prisma.users.delete({
                        where:{
                            id: userData.id
                        }
                    })
                    return "Usuário deletado com sucesso!"
                }catch(err){
                    return "ERRO: DU01- ERRO AO EXCLUIR USUÁRIO."
                }
            }
        }catch(err){
            return "ERRO: FUTD01- ERRO AO EXCLUIR USUÁRIO. USUÁRIO NÃO ENCONTRADO."
        }
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