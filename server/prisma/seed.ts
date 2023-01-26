import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main(){

    const userFuncionario = await prisma.users.create({
        data:{
            tipo: 0,
            senha: '1234',
            Funcionarios:{
                create:{
                    cpf:'109.876.543-21',
                    nome:'Johnna Doe',
                    email:'Johnna.Doe@gmail.com',
                    status: 1,
                }
            }
        }
    })

    const userAlunoCT = await prisma.users.create({
        data:{
            tipo: 1,
            senha: '1234',
            Alunos: {
                create: {
                    nome: 'John Doe',
                    rm: 21111,
                    email: 'john.doe@gmail.com',
                    cpf: '123.456.789.10',
                    data_nascimento: '2001-01-01T17:36:52.107Z',
                    status: 1,
                    curso_tecnico:{
                        create:{
                            nome: "Programação Web",
                            status: 1,
                            periodo: 'Noturno',
                            duracao: 18,
                        }
                    }
                }
            }
        }
    })

    const userAlunoEM = await prisma.users.create({
        data:{
            tipo: 1,
            senha: '1234',
            Alunos: {
                create: {
                    nome: 'John Does',
                    rm: 21112,
                    email: 'john.does@gmail.com',
                    cpf: '123.456.789.09',
                    data_nascimento: '2001-01-02T17:36:52.107Z',
                    status: 1,
                    ensino_medio:{
                        create: {
                            nome: "Ensino médio com Técnico em Database",
                            duracao: 36,
                            periodo: 'Diurno',
                            status: 1
                        }
                    }
                }
            }
        }
    })

    const userEmpresa = await prisma.users.create({
        data:{
            tipo: 2,
            senha: '1234',
            Empresas: {
                create: {
                    cnpj: '123.456.789.11',
                    nome_fantasia: "John Doe's Doe",
                    email: 'JohnDoeEnterprise@gmail.com',
                    status: 1,
                    vagasCriadas:{
                        create: {
                            titulo: "Programador Junior",
                            descricao: "Uma vaga para Programador Junior",
                            salario: 2800,
                            status: 1,
                            data_inicio: '2023-01-26T17:36:52.107Z',
                            data_termino: '2023-02-15T17:36:52.107Z'
                        }
                    }
                }
            }
        }
    })
    
    /* const vagasInscricoes = await prisma.inscricoes_vaga.create({
        data:{
            usersId: userAlunoCT.id,
            vagasId: userEmpresa.
        }
    })
 */

}

main()