import { useEffect, useState } from 'react'
import { 
    Alert,
    Avatar, Button, Chip, Container, Dialog, DialogTitle, Divider, FormControlLabel, Grid, Paper, Stack, Switch, TextField, Tooltip, Typography
 } from "@mui/material";
import Layout from "../layout";
import LayoutBottom from "../layoutBottom";
import TableComponent from '@/components/Table';
import { api } from '@/lib/axios';
import { STATUS, USER_TYPE } from '@/config/constants';
import { GridActionsCellItem, GridRowParams } from '@mui/x-data-grid';
import { CheckCircle, NotePencil, Pencil, PencilSimpleLine, Trash, XCircle } from 'phosphor-react';
import * as Helper from "../../utils/Helper";
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

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
        userData: any[];
        type?: string;
    }

    export function UserDialog(props:userProps){
        const {showDialog, setShowDialog, userData, type, ...other} = props;
        const [selectedUserInfo, setSelectedUserInfo] = useState()
        const [dataNascimento, setDataNascimento] = useState<Dayjs | null>();
        /* const [editEnabled, setEditEnabled] = useState(false) */

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
                console.log(dataTemp)
                setSelectedUserInfo(dataTemp)
                setDataNascimento(dayjs(dataTemp.data_nascimento))
            })
        }
    },[showDialog])

    const handleCloseDialog= ()=>{
        setShowDialog(false)
        setSelectedUserInfo(DATA_INFO)
        /* setEditEnabled(false) */
    }

    const handleDateOfBirth = (date:Dayjs | null)=>{
        setDataNascimento(date)
        let dataTemp = {
            ...selectedUserInfo,
            data_nascimento: date
        }
        setSelectedUserInfo(dataTemp)
    }

    /* const handleEnableEdit = ()=>{
        setEditEnabled(!editEnabled)
    } */

    const handleInput = ((data)=>{
        let { name, value } = data.target
        console.log(type)
        if (name === "cpf") (String(data.target.value).length) < 15? value = Helper.cpf(data.target.value) : value = selectedUserInfo.Alunos[0].cpf? selectedUserInfo.Alunos[0].cpf : selectedUserInfo.Funcionarios[0].cpf 
        if (name === "cnpj") (String(data.target.value).length) < 19? value = Helper.cnpj(data.target.value) : value = selectedUserInfo.Empresas[0].cnpj
        if (name === "celular") value = Helper.cell(data.target.value)
        if (name === "telefone") value = Helper.tell(data.target.value)
        if (name === "rm") (String(data.target.value).length) < 7?   data.target.value != 0? value = Number(Helper.numbersOnlyFilter(data.target.value)) : value = null : value = selectedUserInfo.Alunos[0].rm
        if (name === "tipo") value = Number(data.target.value)
        if (name === "status") value = Number(data.target.value)
        if (name === 'nome') value = Helper.wordOnlyFilter(data.target.value)

        let dataTemp = {
            ...selectedUserInfo,
            [name]: value
        }
        setSelectedUserInfo(dataTemp)
        console.log(dataTemp)
    })

    return (
        <Dialog open={showDialog} fullWidth onClose={handleCloseDialog}>
            <Container >
                <DialogTitle className=' text-2xl text-center '> Editar Usuário </DialogTitle>
                <Paper>
                    {/* {editEnabled?
                        <Grid container justifyContent={"end"} alignItems={"center"} className='p-2 bg-gray-500'>
                            <Grid  item >
                                <Typography className='text-white font-thin'>
                                    Edição Habilitada
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Button className='ml-3 border border-zinc-800  hover:border-zinc-900 rounded-md bg-orange-500 hover:bg-orange-600'>
                                    <PencilSimpleLine onClick={handleEnableEdit} color="white" weight='regular' size={20} />
                                </Button>
                            </Grid>
                        </Grid>
                    :
                        <Grid container justifyContent={"end"} alignItems={"center"} className='p-2 bg-gray-500'>
                            <Grid  item >
                                <Typography className='text-white font-thin'>
                                    Habilitar Edição
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Button className='ml-3 border border-zinc-800  hover:border-zinc-900 rounded-md bg-orange-500 hover:bg-orange-600'>
                                    <PencilSimpleLine onClick={handleEnableEdit}  color="white" weight='regular' size={20} />
                                </Button>
                            </Grid>
                        </Grid>
                    } */}
                    <Divider />
                    <Grid container spacing={2} alignItems={'center'} className='p-2'>
                        <Grid item xs={12} md={4}>
                            <TextField 
                                onChange={handleInput}
                                label="Nome"
                                name="nome"
                                value={selectedUserInfo?.nome}
                            />
                        </Grid>
                        {selectedUserInfo?.cnpj == null?
                        <Grid item xs={12} md={4}>
                            <TextField 
                                onChange={handleInput}
                                label="CPF"
                                name="cpf"
                                value={selectedUserInfo?.cpf}
                            />
                        </Grid>
                        :
                        <Grid item xs={12} md={4}>
                            <TextField 
                                onChange={handleInput}
                                label="CNPJ"
                                name="cnpj"
                                value={selectedUserInfo?.cnpj}
                            />
                        </Grid>
                        }
                        <Grid item xs={12} md={4} >
                            <FormControlLabel
                                control={<Switch color="primary" checked={selectedUserInfo?.status === STATUS.ATIVO}  />}
                                label="Status"
                                labelPlacement="top"
                                name="status"
                                onChange={()=>handleInput({target:{name:"status", value: selectedUserInfo?.status === STATUS.INATIVO? STATUS.ATIVO: STATUS.INATIVO}})}
                            />
                            <Tooltip 
                                arrow 
                                title={`O usuário está/será definido como: ${selectedUserInfo?.status === STATUS.INATIVO? "INATIVO": "ATIVO"}`}
                                placement='top'
                            >
                                <Chip
                                    label={selectedUserInfo?.status === STATUS.ATIVO? 
                                        <CheckCircle size={30} color="#008700" weight='fill'/>
                                        : 
                                        <XCircle size={30} color='#cf0000' weight="fill"/>}
                                    variant={"outlined"}
                                />
                            </Tooltip>
                        </Grid>
                        { (type === "Aluno" ) && (dataNascimento != null) &&
                        <>
                            <Grid item className="mt-2" xs={12} sm={4}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Stack >
                                        <DesktopDatePicker
                                            label="Data de Nascimento"
                                            value={dataNascimento}
                                            views={["year", "month", "day"]}
                                            onChange={handleDateOfBirth}
                                            format="DD/MM/YYYY"
                                        />
                                    </Stack>
                                </LocalizationProvider>
                            </Grid>
                        </>
                        }
                    </Grid>
                </Paper>
            </Container>
        </Dialog>
    )
    };

export function DeleteDialog(props:userProps){
    const {showDialog, setShowDialog, userData, ...other} = props;
    const [userInfo, setUserInfo] = useState();
    
    useEffect(()=>{
        if (userData !== undefined){
            api.get(`/users/getInfo/${userData}`).then(res=>{
                console.log(res)
                setUserInfo(res.data)
            })
        }
    },[showDialog])

    const handleClose=(()=>{
        setShowDialog(false)
        setUserInfo([])
    })

    const handleDeleteUser=(async()=>{
        const deleteUser = await api.delete(`/user/delete/${Number(userInfo?.id)}`)
        alert(deleteUser.data)
        setShowDialog(false)
        setUserInfo([])
    })

    return(
        userInfo != undefined &&
        <Dialog open={showDialog} onClose={handleClose} fullWidth>
            <Grid container justifyContent={'center'} className='p-2'>
                <DialogTitle className='bg-EtecLightGray w-full text-center p-2'>Deseja Remover este usuário?</DialogTitle>
                <Typography className='text-center text-lg p-2'>Você está preste a excluir <Typography className='text-blue-500 text-lg'>{userInfo?.nome}</Typography> você estará excluindo todos os registros que esse usuário possuí. Você tem certeza?</Typography>
                <Grid container spacing={2} item xs={12} className='p-2'>
                    <Grid item xs={6} className='text-center'>
                        <Button onClick={handleClose} className=' bg-red-700 hover:bg-red-600 text-white w-full'>Não, cancelar</Button>
                    </Grid>
                    <Grid item xs={6} className='text-center'>
                        <Button onClick={handleDeleteUser} className='bg-green-700 hover:bg-green-600 text-white w-full '>Sim, desejo excluir {userInfo?.nome}</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Dialog>
    )
}


export default function AdminPanel() {
    
    const [userList, setUserList] = useState<filterQueryProps[]>([])
    const [ensinoMedioList, setEnsinoMedioList] = useState<ensinoMedio[]>()
    const [ensinoTecnicoList, setEnsinoTecnicoList] = useState<cursoTecnico[]>()
    const [selectedUserId, setSelectedUserId] = useState()
    const [selectedUserType, setSelectedUserType] = useState()
    const [showDialog, setShowDialog ] = useState<boolean>(false);
    const [showDialogDelete, setShowDialogDelete ] = useState<boolean>(false);

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

    const handleDeleteUser=(params:any)=>{
        setShowDialogDelete(true)
        setSelectedUserId(params.row.id)
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
              <GridActionsCellItem icon={<Trash/>} onClick={()=>handleDeleteUser(params)} label="Apagar" showInMenu />,
            ]
          }
    ]
    return (
        <>
            <Layout />
            <Grid 
                justifyContent="center"
                container
                className="mb-24 mt-12 p-10"
            >
                <Paper className="bg-white w-full">
                    <TableComponent rows={userList} columns={columns} title='Gerenciar Usuários' />
                </Paper>
            </Grid>
            <UserDialog
                showDialog={showDialog}
                setShowDialog={setShowDialog}
                userData={selectedUserId}
                type={selectedUserType}
            />
            <DeleteDialog
                showDialog={showDialogDelete}
                setShowDialog={setShowDialogDelete}
                userData={selectedUserId}
            />
            <LayoutBottom />
        </>
    )
} 