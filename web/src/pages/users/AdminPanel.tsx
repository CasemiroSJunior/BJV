import { useEffect, useState } from 'react'
import {
    Button, Chip, Container, Dialog, DialogTitle, Divider, FormControl, FormControlLabel, Grid, 
    IconButton, InputAdornment, InputLabel, MenuItem, Paper, Select, Stack, Switch, TextField, 
    Tooltip, Typography
} from "@mui/material";

import Layout from "../layout";
import LayoutBottom from "../layoutBottom";
import TableComponent from '@/components/Table';
import { api } from '@/lib/axios';
import { STATUS, USER_TYPE } from '@/config/constants';
import { GridActionsCellItem, GridRowParams } from '@mui/x-data-grid';
import { CheckCircle, Eye, EyeClosed, NotePencil, Pencil, PencilSimpleLine, Trash, TrashSimple, XCircle } from 'phosphor-react';
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
    id: number,
    nome: string,
    tipo: number,
    email: string,
    status: number,
    Alunos: [{
        rm: number,
        cpf: string
        technical: string,
        highschool: string,
        curso_tecnico_Id: number,
        curso_ensino_medio_Id: number,
    }],
    Empresas: [{
        cnpj: string
    }],
    Funcionarios: [{
        cpf: string
    }],
}

interface filterQueryProps {
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

interface userProps {
    showDialog: boolean;
    setShowDialog: (showDialog: boolean) => void;
    userData: any[];
    type?: string;
}

export function UserDialog(props: userProps) {
    const { showDialog, setShowDialog, userData, type, ...other } = props;
    const [selectedUserInfo, setSelectedUserInfo] = useState()
    const [dataNascimento, setDataNascimento] = useState<Dayjs | null>();
    const [ensinoMedioList, setEnsinoMedioList] = useState<ensinoMedio[]>()
    const [ensinoTecnicoList, setEnsinoTecnicoList] = useState<cursoTecnico[]>()
    const [emailConfirmation, setEmailConfirmation] = useState<string>("");
    const [editEnabled, setEditEnabled] = useState(false)
    const [changePassword, setChangePassword] = useState(false);
    const DATA_INFO: any = {
        id: null,
        tipo: null,
        nome: null,
        cpf: null,
        cnpj: null,
        email: null,
        rm: null,
        status: null,
        technical: null,
        highschool: null,
        data_nascimento: null,
        celular: null,
        telefone: null,
    }


    const handleGetData = async () => {
        await api.get('/cursos/tecnico').then((response) => { setEnsinoTecnicoList(response.data.curso) })
        await api.get('/cursos/medio').then((response) => { setEnsinoMedioList(response.data.curso) })
    }

    useEffect(() => {
        if (userData !== undefined) {
            api.get(`/users/getInfo/${userData}`).then(res => {
                let dataTemp = {
                    ...DATA_INFO,
                    id: res.data?.id,
                    nome: res.data?.nome,
                    cpf: res.data?.Alunos[0]?.cpf ? res.data?.Alunos[0]?.cpf : res.data?.Funcionarios[0]?.cpf,
                    cnpj: res.data?.Empresas[0]?.cnpj? Helper.cnpj(res.data?.Empresas[0]?.cnpj) : null,
                    email: res.data?.email,
                    rm: res.data?.Alunos[0]?.rm,
                    status: res.data?.status,
                    technical: res.data?.Alunos[0]?.curso_tecnico_Id,
                    highschool: res.data?.Alunos[0]?.curso_ensino_medio_Id,
                    data_nascimento: res.data?.Alunos[0]?.data_nascimento,
                    celular: res.data?.celular,
                    telefone: res.data?.Alunos[0]?.telefone,
                    tipo: res.data?.tipo
                }
                setEmailConfirmation(res.data?.email)
                console.log(dataTemp)
                setSelectedUserInfo(dataTemp)
                setDataNascimento(dayjs(dataTemp.data_nascimento))
                handleGetData()
            })
        }
    }, [showDialog])

    const handleCloseDialog = () => {
        setShowDialog(false)
        setSelectedUserInfo(DATA_INFO)
        setEditEnabled(false)
    }

    const handleSetEmailValidation = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setEmailConfirmation(e.target.value)
    }

    const handleDateOfBirth = (date: Dayjs | null) => {
        setDataNascimento(date)
        let dataTemp = {
            ...selectedUserInfo,
            data_nascimento: date
        }
        setSelectedUserInfo(dataTemp)
    }

    const handleEnableEdit = () => {
        setEditEnabled(!editEnabled)
    }

    const handleChangePassword = (e: boolean) => {
        setChangePassword(e)
        console.log("foi")
        console.log(e)
    }

    const handleInput = ((data) => {
        let { name, value } = data.target
        console.log(type)
        if (name === "cpf") (String(data.target.value).length) < 15 ? value = Helper.cpf(data.target.value) : value = selectedUserInfo.Alunos[0].cpf ? selectedUserInfo.Alunos[0].cpf : selectedUserInfo.Funcionarios[0].cpf
        if (name === "cnpj") (String(data.target.value).length) < 19 ? value = Helper.cnpj(data.target.value) : value = selectedUserInfo.Empresas[0].cnpj
        if (name === "celular") value = Helper.cell(data.target.value)
        if (name === "telefone") value = Helper.tell(data.target.value)
        if (name === "rm") (String(data.target.value).length) < 7 ? data.target.value != 0 ? value = Number(Helper.numbersOnlyFilter(data.target.value)) : value = null : value = selectedUserInfo.Alunos[0].rm
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

    const handleSubmit = async()=>{
        try{
            const updateUser = await api.patch(`/update/user/${selectedUserInfo!.id}`,selectedUserInfo);
            console.log(updateUser)
            alert(updateUser.data)
            handleCloseDialog()
        }catch(err){
            alert("Erro ao atualizar usuário.")
        }
    }

    return (
        <Dialog open={showDialog} fullWidth onClose={handleCloseDialog}>
            <Container >
                <DialogTitle className=' text-2xl text-center '> Editar Usuário </DialogTitle>
                <Paper>
                    {editEnabled ?
                        <Grid container justifyContent={"end"} alignItems={"center"} className='p-2 bg-EtecLightGray'>
                            <Grid item >
                                <Typography className='text-black font-thin'>
                                    Modo Edição
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Tooltip arrow title="Você habilitou a edição deste usuário, clique para desativar">
                                    <Button onClick={handleEnableEdit} className='ml-3 border border-zinc-800  hover:border-zinc-900 rounded-md bg-DefaultRedEtec hover:bg-DefaultHoverBoldEtec'>
                                        <PencilSimpleLine color="white" weight='regular' size={20} />
                                    </Button>
                                </Tooltip>
                            </Grid>
                        </Grid>
                        :
                        <Grid container justifyContent={"end"} alignItems={"center"} className='p-2 bg-EtecLightGray'>
                            <Grid item >
                                <Typography className='text-black font-thin'>
                                    Modo Visualização
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Tooltip arrow title="Clique para habilitar a visualização deste usuário">
                                    <Button onClick={handleEnableEdit} className='ml-3 border border-zinc-800  hover:border-zinc-900 rounded-md bg-DefaultRedEtec hover:bg-DefaultHoverBoldEtec'>
                                        <Eye color="white" weight='regular' size={20} />
                                    </Button>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    }
                    <Divider />
                    <Grid container spacing={2} alignItems={'center'} justifyContent={'center'} className='p-2'>
                        <Grid item xs={12} md={4}>
                            <TextField
                                disabled={!editEnabled}
                                onChange={handleInput}
                                label="Nome"
                                name="nome"
                                value={selectedUserInfo?.nome}
                            />
                        </Grid>
                        {selectedUserInfo?.cnpj == null ?
                            <Grid item xs={12} md={4}>
                                <TextField
                                    disabled={!editEnabled}
                                    onChange={handleInput}
                                    label="CPF"
                                    name="cpf"
                                    value={selectedUserInfo?.cpf}
                                />
                            </Grid>
                            :
                            <Grid item xs={12} md={4}>
                                <TextField
                                    disabled={!editEnabled}
                                    onChange={handleInput}
                                    label="CNPJ"
                                    name="cnpj"
                                    value={selectedUserInfo?.cnpj}
                                />
                            </Grid>
                        }
                        <Grid item xs={12} md={4} >
                            <FormControlLabel
                                disabled={!editEnabled}
                                control={<Switch color="primary" checked={selectedUserInfo?.status === STATUS.ATIVO} />}
                                label="Status"
                                labelPlacement="top"
                                name="status"
                                onChange={() => handleInput({ target: { name: "status", value: selectedUserInfo?.status === STATUS.INATIVO ? STATUS.ATIVO : STATUS.INATIVO } })}
                            />
                            <Tooltip
                                arrow
                                title={`O usuário está/será definido como: ${selectedUserInfo?.status === STATUS.INATIVO ? "INATIVO" : "ATIVO"}`}
                                placement='top'
                            >
                                <Chip
                                    label={selectedUserInfo?.status === STATUS.ATIVO ?
                                        <CheckCircle size={30} color="#008700" weight='fill' />
                                        :
                                        <XCircle size={30} color='#cf0000' weight="fill" />}
                                    variant={"outlined"}
                                />
                            </Tooltip>
                        </Grid>
                        {(type === "Aluno") && (dataNascimento != null) &&
                            <>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        disabled={!editEnabled}
                                        fullWidth
                                        onChange={handleInput}
                                        label="RM"
                                        name="rm"
                                        value={selectedUserInfo?.rm}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <Stack >
                                            <DesktopDatePicker
                                                disabled={!editEnabled}
                                                label="Data de Nascimento"
                                                value={dataNascimento}
                                                views={["year", "month", "day"]}
                                                onChange={handleDateOfBirth}
                                                format="DD/MM/YYYY"
                                            />
                                        </Stack>
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={10}>
                                    <FormControl className="w-full">
                                        <InputLabel className="w-full" id="ensinoMedio">Ensino Médio</InputLabel>
                                        <Select
                                            disabled={!editEnabled}
                                            name="highschool"
                                            labelId="select-ensinoMedio"
                                            label="Ensino Médio"
                                            value={selectedUserInfo!.highschool}
                                            onChange={handleInput}
                                        >
                                            {ensinoMedioList?.map((curso: ensinoMedio['curso'][0]) => (
                                                <MenuItem
                                                    key={curso.id}
                                                    value={String(curso?.id)}
                                                >
                                                    {curso.nome}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2}>
                                    <Tooltip arrow title="Ao clicar, irá desvincular o curso do Aluno." >
                                        <Button
                                            disabled={!editEnabled}
                                            className={
                                                `border-zinc-700  hover:border-zinc-800  ${editEnabled ? "bg-gray-700 hover:bg-gray-800  text-white " : "bg-gray-200 hover:bg-gray-300 text-black"} `
                                            }
                                            onClick={() => setSelectedUserInfo({ ...selectedUserInfo, highschool: null })}
                                        >
                                            <TrashSimple size={28} />
                                        </Button>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={10}>
                                    <FormControl className="w-full">
                                        <InputLabel className="w-full" id="ensinoTecnico">Curso Técnico</InputLabel>
                                        <Select
                                            name="technical"
                                            disabled={!editEnabled}
                                            labelId="select-cursoTecnico"
                                            label="Curso Técnico"
                                            value={selectedUserInfo!.technical}
                                            onChange={handleInput}
                                        >
                                            {ensinoTecnicoList?.map((curso: cursoTecnico['curso'][0]) => (
                                                <MenuItem
                                                    key={curso.id}
                                                    value={String(curso?.id)}
                                                >
                                                    {curso.nome}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2}>
                                    <Tooltip arrow title="Ao clicar, irá desvincular o curso do Aluno." >
                                        <Button
                                            disabled={!editEnabled}
                                            className={
                                                `border-zinc-700  hover:border-zinc-800  ${editEnabled ? "bg-gray-700 hover:bg-gray-800  text-white " : "bg-gray-200 hover:bg-gray-300 text-black"}`
                                            }
                                            onClick={() => setSelectedUserInfo({ ...selectedUserInfo, technical: null })}
                                        >
                                            <TrashSimple size={28} />
                                        </Button>
                                    </Tooltip>
                                </Grid>
                            </>
                        }
                        <Grid item xs={12} md={6} className="mt-2" >
                            <TextField
                                variant="outlined"
                                disabled={!editEnabled}
                                value={selectedUserInfo?.email}
                                onChange={handleInput}
                                name="email"
                                label="E-Mail"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6} className="mt-2" >
                            <TextField
                                variant="outlined"
                                value={emailConfirmation}
                                disabled={!editEnabled}
                                error={selectedUserInfo?.email !== emailConfirmation ? true : false}
                                helperText={selectedUserInfo?.email !== emailConfirmation ? "E-Mail divergentes" : ""}
                                onChange={handleSetEmailValidation}
                                name="emailConfirmation"
                                label="Confirmação de E-Mail"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6} className="mt-2" >
                            <TextField
                                variant="outlined"
                                disabled={!editEnabled}
                                value={selectedUserInfo?.telefone}
                                onChange={handleInput}
                                name="telefone"
                                label="Telefone"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6} className="mt-2" >
                            <TextField
                                variant="outlined"
                                disabled={!editEnabled}
                                value={selectedUserInfo?.celular}
                                onChange={handleInput}
                                name="celular"
                                label="Celular"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={8} className='p-2'>
                            <Button
                                disabled={!editEnabled}
                                onClick={() => handleChangePassword(true)}
                                className={` w-full ${editEnabled ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-200 hover:bg-gray-300 text-black"}`}
                            >
                                Atualizar Senha
                            </Button>
                        </Grid>
                        <Divider/>
                        <Grid item xs={6} className='p-2'>
                            <Button
                                disabled={!editEnabled}
                                onClick={handleCloseDialog}
                                className={` w-full ${editEnabled ? "bg-red-600 hover:bg-red-700 text-white" : "bg-gray-200 hover:bg-gray-300 text-black"}`}
                            >
                                Cancelar
                            </Button>
                        </Grid>
                        <Grid item xs={6} className='p-2'>
                            <Button
                                disabled={!editEnabled}
                                onClick={handleSubmit}
                                className={` w-full ${editEnabled ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-200 hover:bg-gray-300 text-black"}`}
                            >
                                    Atualizar
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
            <PasswordChange
                showDialog={changePassword}
                setShowDialog={handleChangePassword}
                userData={selectedUserInfo}
            />
        </Dialog>
    )
};

export function PasswordChange(props: userProps) {
    const { showDialog, setShowDialog, userData, ...other } = props;
    const [userInfo, setUserInfo] = useState();
    const [passwordConfirmation, setPasswordConfirmation] = useState<string >("");
    const [passwordHidden, setPasswordHidden] = useState<boolean>(true)
    const [password, setPassword] = useState("");

    const handleClose = (() => {
        setShowDialog(false)
        setPasswordConfirmation("")
        setPasswordHidden(true)
        setPassword("")
    })

    const handleChangePassword = (async () => {

        if (passwordConfirmation === password){
            let dataTemp = {
                ...userData,
                senha: password
            }
        
            const updatePassword = await api.patch(`/changePass/${Number(dataTemp.id)}`,dataTemp)
            alert(updatePassword.data)
            setShowDialog(false)
            setUserInfo([])
            setPasswordConfirmation("")
            setPasswordHidden(true)
            setPassword("")
        }else{
            alert("Verifique a diferença de senha antes de prosseguir!")
        }
    })

    const handleClickShowPassword = () => {
        setPasswordHidden(!passwordHidden);
    };

    const handleSetPasswordValidation = (e: React.ChangeEvent<HTMLTextAreaElement>) =>{
        setPasswordConfirmation(e.target.value)
    }

    const handleChangePass = (e)=>{
        setPassword(e.target.value)
    }

    return (
        <Dialog open={showDialog} onClose={handleClose} fullWidth>
            <Grid container justifyContent={'center'} className='p-2'>
                <DialogTitle className='bg-EtecLightGray w-full text-center p-2'>Você irá alterar a senha deste usuário.</DialogTitle>
                <Grid container justifyContent={'center'} spacing={2} item xs={12} className='p-2'>
                    <Grid item xs={12} md={6} className="mt-2" >
                        <TextField
                            variant="outlined"
                            value={password}
                            type={passwordHidden ? "password" : "text"}
                            onChange={handleChangePass}
                            name="senha"
                            label="Senha"
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => handleClickShowPassword()}>
                                            <Tooltip title="Habilita/Desabilita a visualização de senha.">
                                                {passwordHidden ? <EyeClosed /> : <Eye />}
                                            </Tooltip>
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} className="mt-2" >
                        <TextField
                            variant="outlined"
                            value={passwordConfirmation}
                            type={passwordHidden ? "password" : "text"}
                            error={password !== passwordConfirmation ? true : false}
                            helperText={password !== passwordConfirmation ? "Senhas divergentes" : ""}
                            onChange={handleSetPasswordValidation}
                            name="passwordConfirmation"
                            label="Confirmação de Senha"
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => handleClickShowPassword()}>
                                            <Tooltip title="Habilita/Desabilita a visualização de senha.">
                                                {passwordHidden ? <EyeClosed /> : <Eye />}
                                            </Tooltip>
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container justifyContent={'center'} spacing={2} className='mt-2'>
                    <Grid item xs={6}>
                        <Button onClick={handleClose}className="bg-red-600 hover:bg-red-700 text-white w-full p-2">
                            Cancelar
                        </Button>
                    </Grid>
                    <Grid item xs={6} >
                        <Button onClick={handleChangePassword} className="bg-green-600 hover:bg-green-700 text-white w-full p-2">
                            Alterar
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Dialog>
    )
}

export function DeleteDialog(props: userProps) {
    const { showDialog, setShowDialog, userData, ...other } = props;
    const [userInfo, setUserInfo] = useState();

    useEffect(() => {
        if (userData !== undefined) {
            api.get(`/users/getInfo/${userData}`).then(res => {
                console.log(res)
                setUserInfo(res.data)
            })
        }
    }, [showDialog])

    const handleClose = (() => {
        setShowDialog(false)
        setUserInfo([])
    })

    const handleDeleteUser = (async () => {
        const deleteUser = await api.delete(`/user/delete/${Number(userInfo?.id)}`)
        alert(deleteUser.data)
        setShowDialog(false)
        setUserInfo([])
    })

    return (
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
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [showDialogDelete, setShowDialogDelete] = useState<boolean>(false);

    const handleGetData = async () => {
        await api.get('/cursos/tecnico').then((response) => { setEnsinoTecnicoList(response.data.curso) })
        await api.get('/cursos/medio').then((response) => { setEnsinoMedioList(response.data.curso) })
    }

    useEffect(() => {
        handleGetData()
    }, [])

    const DATA_QUERY = {
        id: null,
        tipo: null,
        email: null,
        rm: null,
        status: 0,
        highschool: null,
        technical: null,

    }

    const handleSetUserInfo = (params: any) => {
        setSelectedUserId(params.row.id)
        setShowDialog(true)
        setSelectedUserType(params.row.tipo)
    }

    const handleDeleteUser = (params: any) => {
        setShowDialogDelete(true)
        setSelectedUserId(params.row.id)
    }


    useEffect(() => {
        api.get('/users/type//name//status//technical//highschool/').then(response => {
            let userTypeName: string;
            let CNPJCPF: string;
            let LIST: filterQueryProps[] = [];
            response.data.userList.map((user: userProps) => {
                if (user.tipo === USER_TYPE.FUNCIONARIO) {
                    userTypeName = "Funcionário"
                    CNPJCPF = user.Funcionarios[0].cpf
                }

                if (user.tipo === USER_TYPE.ALUNO) {
                    userTypeName = "Aluno"
                    CNPJCPF = user.Alunos[0].cpf
                }
                if (user.tipo === USER_TYPE.EMPRESA) {
                    userTypeName = "Empresa"
                    CNPJCPF = user.Empresas[0].cnpj
                }

                const FILTER_QUERY: any = {
                    ...DATA_QUERY,
                    id: user.id,
                    tipo: userTypeName,
                    nome: user.nome,
                    cpf: CNPJCPF,
                    email: user.email,
                    rm: user.Alunos[0]?.rm !== undefined ? user.Alunos[0].rm : "",
                    status: user.status === 0 ? "Inativo" : "Ativo",
                    technical: ensinoTecnicoList?.filter((e: { id: number }) => e.id === user.Alunos[0]?.curso_tecnico_Id)[0]?.nome,
                    highschool: ensinoMedioList?.filter((e: { id: number }) => e.id === user.Alunos[0]?.curso_ensino_medio_Id)[0]?.nome,
                }

                LIST.push(FILTER_QUERY)
                setUserList(LIST)
            })
        })

    }, [ensinoMedioList, ensinoTecnicoList])

    const columns = [
        { field: "id", headerName: "ID", width: 80 },
        { field: "tipo", headerName: "Tipo", width: 100 },
        { field: "nome", headerName: "Nome", width: 170 },
        { field: "cpf", headerName: "CPF/CNPJ", sortable: false, width: 150 },
        { field: "email", headerName: "E-Mail", width: 220 },
        { field: "rm", headerName: "RM", width: 100 },
        { field: "status", headerName: "Status", width: 80 },
        { field: "highschool", flex: 2, headerName: "Ensino Médio", width: 270 },
        { field: "technical", flex: 2, headerName: "Técnico", width: 270 },
        {
            field: 'actions',
            type: 'actions',
            getActions: (params: GridRowParams) => [
                <GridActionsCellItem icon={<Pencil size={24} />} onClick={() => handleSetUserInfo(params)} label="Editar" />,
                <GridActionsCellItem icon={<Trash />} onClick={() => handleDeleteUser(params)} label="Apagar" showInMenu />,
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