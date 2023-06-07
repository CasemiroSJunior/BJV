import { useEffect, useState } from 'react'
import { 
    Avatar, Dialog, DialogTitle, Grid, Paper, TextField, Typography
 } from "@mui/material";
import Layout from "../layout";
import LayoutBottom from "../layoutBottom";
import TableComponent from '@/components/Table';
import { api } from '@/lib/axios';
import { USER_TYPE } from '@/config/constants';
import { GridActionsCellItem, GridRowParams } from '@mui/x-data-grid';
import { NotePencil, Pencil, Trash } from 'phosphor-react';

interface cursoTecnico {
    id: number,
    nome: string,
    status: number,
    duracao?: number | undefined,
    periodo?: string | undefined,
  };
  
  interface ensinoMedio {
    id: number,
    nome: string,
    status: number,
    duracao?: number | undefined,
    periodo?: string | undefined,
  };

  interface userProps {
        id:number,
        nome:string,
        tipo:number,
        email: string,
        status: number,
        Alunos:[{
            rm: number,
            cpf:string
            technical: string,
            highschool:string,
            curso_tecnico_Id: number,
            curso_ensino_medio_Id: number,
        }],
        Empresas:[{
            cnpj:string
        }],
        Funcionarios:[{
            cpf:string
        }],
  }

  interface filterQueryProps{
    id: number,
    tipo: string,
    nome: string,
    cpf: string,
    email: string,
    rm: string,
    status: string,
    technical: string,
    highschool: string,
  }

    interface userProps{
        showDialog: boolean;
        setShowDialog: (showDialog: boolean)=> void;
        closeDialog: ()=> void;
        userData: any[];
        type?: string;
    }

    export function UserDialog(props:userProps){
        const {showDialog, setShowDialog, closeDialog, userData, type, ...other} = props;
        const [selectedUserInfo, setSelectedUserInfo] = useState()

        const DATA_INFO:any= {
            id: null,
            tipo: null,
            nome: null,
            cpf: null,
            cnpj:null,
            email: null,
            rm:null,
            status: null,
            technical: null,
            highschool: null,
            data_nascimento:null,
            celular:null,
            telefone:null,
        }

    useEffect(()=>{
        if (userData !== undefined){
            api.get(`/users/getInfo/${userData}`).then(res=>{
                let dataTemp = {...DATA_INFO,
                    id: res.data?.id,
                    nome: res.data?.nome,
                    cpf: res.data?.Alunos[0]?.cpf? res.data?.Alunos[0]?.cpf: res.data?.Funcionarios[0]?.cpf,
                    cnpj: res.data?.Empresas[0]?.cnpj,
                    email: res.data?.email,
                    rm:res.data?.Alunos[0]?.rm,
                    status: res.data?.status,
                    technical: res.data?.Alunos[0]?.curso_tecnico_Id,
                    highschool: res.data?.Alunos[0]?.curso_ensino_medio_Id,
                    data_nascimento: res.data?.Alunos[0]?.data_nascimento,
                    celular:res.data?.celular,
                    telefone: res.data?.Alunos[0]?.telefone
                }
                setSelectedUserInfo(dataTemp)
            })
        }
    },[showDialog])

    const handleInput = (()=>{
        
    })

    return (
        <Dialog open={showDialog} fullWidth onClose={closeDialog}>
            <DialogTitle> Editar Usuário </DialogTitle>
            <Paper>
                <Grid justifyContent={'center'} alignContent={'center'} container>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            onChange={()=>console.log(selectedUserInfo)}
                            label="Nome"
                            name="nome"
                            value={selectedUserInfo?.nome}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </Dialog>
    )
    };


export default function AdminPanel() {
    
    const [userList, setUserList] = useState<filterQueryProps[]>([])
    const [ensinoMedioList, setEnsinoMedioList] = useState<ensinoMedio[]>()
    const [ensinoTecnicoList, setEnsinoTecnicoList] = useState<cursoTecnico[]>()
    const [selectedUserId, setSelectedUserId] = useState()
    const [selectedUserType, setSelectedUserType] = useState()
    const [showDialog, setShowDialog ] = useState<boolean>(false);

    const handleGetData = async()=>{
        await api.get('/cursos/tecnico').then((response)=> {setEnsinoTecnicoList(response.data.curso)})
        await api.get('/cursos/medio').then((response)=> {setEnsinoMedioList(response.data.curso)})
    }

    useEffect(()=>{
        handleGetData()
    },[])

    const DATA_QUERY= {
        id: null,
        tipo: null,
        email: null,
        rm: null,
        status: 0,
        highschool:null,
        technical: null,

    }

    const handleSetUserInfo=(params:any)=>{
        setSelectedUserId(params.row.id)
        setShowDialog(true)
        setSelectedUserType(params.row.tipo)
    }

    const handleCloseDialog= ()=>{
        setShowDialog(false)
    }

    useEffect( ()=>{
        api.get('/users/type//name//status//technical//highschool/').then(response=> { 
            let userTypeName:string;
            let CNPJCPF:string;
            let LIST: filterQueryProps[] = [];
            response.data.userList.map( (user:userProps)=>{
                if (user.tipo === USER_TYPE.FUNCIONARIO) {
                    userTypeName="Funcionário"
                    CNPJCPF=user.Funcionarios[0].cpf
                }

                if (user.tipo === USER_TYPE.ALUNO) {
                    userTypeName="Aluno"
                    CNPJCPF=user.Alunos[0].cpf
                }
                if (user.tipo === USER_TYPE.EMPRESA) {
                    userTypeName="Empresa"
                    CNPJCPF=user.Empresas[0].cnpj
                }
                
                const FILTER_QUERY:any= {... DATA_QUERY,
                    id: user.id,
                    tipo: userTypeName,
                    nome: user.nome,
                    cpf: CNPJCPF,
                    email: user.email,
                    rm: user.Alunos[0]?.rm !== undefined? user.Alunos[0].rm : "",
                    status: user.status === 0? "Inativo": "Ativo",
                    technical: ensinoTecnicoList?.filter((e:{id: number})=> e.id === user.Alunos[0]?.curso_tecnico_Id)[0]?.nome,
                    highschool: ensinoMedioList?.filter((e:{id: number})=> e.id === user.Alunos[0]?.curso_ensino_medio_Id)[0]?.nome,
                }
                
                LIST.push(FILTER_QUERY)
                setUserList(LIST)
            })
        })
        
    },[ensinoMedioList, ensinoTecnicoList])

    const columns = [
        {field: "id", headerName:"ID", width:80},
        {field: "tipo", headerName:"Tipo", width:100},
        {field: "nome", headerName:"Nome", width:170},
        {field: "cpf", headerName:"CPF/CNPJ", sortable:false,width:150},
        {field: "email", headerName:"E-Mail", width:220},
        {field: "rm", headerName:"RM", width:100},
        {field: "status", headerName:"Status", width:80},
        {field: "highschool", flex:2, headerName:"Ensino Médio", width:270},
        {field: "technical", flex:2, headerName:"Técnico", width:270},
        {
            field: 'actions',
            type: 'actions',
            getActions: (params: GridRowParams) => [
              <GridActionsCellItem icon={<Pencil size={24}/>} onClick={()=>handleSetUserInfo(params)} label="Editar" />,
              <GridActionsCellItem icon={<Trash/>} onClick={()=>console.log("Delete Action")} label="Apagar" showInMenu />,
            ]
          }
    ]
    return (
        <>
            <Layout />
            <Grid 
                justifyContent="center"
                container
                className="mb-24 mt-12"
            >
                <Paper className="bg-white w-full">
                    <TableComponent rows={userList} columns={columns} title='Gerenciar Usuários' />
                </Paper>
            </Grid>
            <UserDialog
                showDialog={showDialog}
                closeDialog={handleCloseDialog}
                userData={selectedUserId}
                type={selectedUserType}
            />
            <LayoutBottom />
        </>
    )
} 