import { Box, Button, Checkbox, Chip, FormControl, FormControlLabel, Grid, InputAdornment, InputLabel, MenuItem, OutlinedInput, Paper, Select, Stack, Switch, TextField, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Layout from "../../../layout";
import LayoutBottom from "../../../layoutBottom";
import { REMUNERATION, STATUS, VACANCY_TYPE } from "@/config/constants";
import { LocalizationProvider, DesktopDatePicker  } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { api } from "@/lib/axios";

interface newVacancyProps{
    titulo: string | null;
    descricao: string | null ;
    salario: number | null ;
    tipo: number | null ;
    remunerado: number;
    confidencial_nome: number ;
    confidencial_salario: number;
    status: number;
    empresasUsersId: number;
    data_inicio: string | null;
    data_termino: string | null;
}


export default function VacancyRegister() {
    const router = useRouter();

    const [vacancyData, setVacancyData] = useState<newVacancyProps>()

    const NEW_VACANCY = {
        titulo : vacancyData?.titulo? vacancyData?.titulo : null,
        descricao : vacancyData?.descricao? vacancyData?.descricao : null,
        salario: vacancyData?.salario? vacancyData?.salario : 0,
        tipo: vacancyData?.tipo? vacancyData?.tipo : VACANCY_TYPE.ESTAGIO,
        remunerado: vacancyData?.remunerado? vacancyData?.remunerado : STATUS.ATIVO,
        confidencial_nome: vacancyData?.confidencial_nome? vacancyData?.confidencial_nome: STATUS.INATIVO,
        confidencial_salario: vacancyData?.confidencial_salario? vacancyData?.confidencial_salario :STATUS.INATIVO,
        status: vacancyData?.status? vacancyData?.status :  STATUS.ATIVO,
        empresasUsersId: vacancyData?.empresasUsersId? vacancyData?.empresasUsersId : 4 ,
        data_inicio: vacancyData?.data_inicio? vacancyData?.data_inicio : null,
        data_termino: vacancyData?.data_termino? vacancyData?.data_termino : null,
    };
    
    const [newVacancy, setNewVacancy] = useState<newVacancyProps>(NEW_VACANCY);
    const [startDate, setStartDate] = useState<Dayjs | null>(dayjs(new Date()),);
    const [finalDate, setFinalDate] = useState<Dayjs | null>(dayjs(new Date()),);
    const [userId, setUserId] = useState<number | null | undefined | string[] | string>(null)
    const [vacancyId, setVacancyId] = useState<number | null | undefined | string[] | string>(null)

    useEffect(()=>{
        setUserId(router.query.userId)
        setVacancyId(router.query.vacancyId)
        console.log(router.query.userId)
        console.log(router.query.vacancyId)
    },[router.query.vacancyId, router.query.userId])


    useEffect(()=>{
        const fetchData= (async()=>{
            try{
                await api.get(`/vacancy/userId/${userId}/vacancyId/${vacancyId}`).then(response => {setVacancyData(response.data.vacancyInfo[0])})
            }catch(err){
                router.push("/vacancy/VacancyList")
            }
        })
        if (userId != undefined && vacancyId != undefined)
            fetchData()
            setNewVacancy(NEW_VACANCY);
    },[userId, vacancyId])
    
    useEffect(()=>{
        setNewVacancy(NEW_VACANCY)
    },[vacancyData])

    const handleCreateVacancy =async()=>{
        try{
            await api.post(`vacancy/create`,{
                titulo: newVacancy.titulo,
                descricao: newVacancy.descricao,
                salario: newVacancy.remunerado === 1? (newVacancy.confidencial_salario == 1? 0 : Number((String(newVacancy.salario).replace(",", ".")).replace(".",""))) : 0,
                tipo: newVacancy.tipo,
                remunerado: newVacancy.tipo === VACANCY_TYPE.CLT? 1 : newVacancy.remunerado,
                confidencial_nome: newVacancy.confidencial_nome,
                confidencial_salario: newVacancy.confidencial_salario,
                status: newVacancy.status,
                empresasUsersId: newVacancy.empresasUsersId,
                data_termino: finalDate?.format('YYYY-MM-DD'),
                data_inicio: startDate?.format('YYYY-MM-DD'),
                
            })
            alert("Vaga criada com sucesso")
            setNewVacancy(NEW_VACANCY);
            setStartDate(dayjs(new Date()));
            setFinalDate(dayjs(new Date()))
        }catch(err){
            alert("Erro ao criar vaga, por favor, revise as informações")
        }

    }
    
    const handleInput = (event: { target: { name: string; value: any; }; }) =>{
        let { name, value } = event.target;
        let TempVacancy=({...newVacancy, [name]: value})
        console.log(vacancyData)
        console.log(NEW_VACANCY)
        setNewVacancy(TempVacancy)
    }

    const handleChangeStartDate = (date:Dayjs | null)=>{
        setStartDate(date)
    }
    const handleChangeFinalDate = (date:Dayjs | null)=>{
        setFinalDate(date)
    }

    

    return (
        <> 
            <Layout />
                <Grid container className="mb-24 mt-12 justify-center">
                    <Paper className="bg-white w-3/6 justify-center p-2" >
                        <Grid container spacing={2} >
                            <Grid sm={9} xs={12} item className="w-full">
                                <TextField name="titulo" value={newVacancy?.titulo? newVacancy.titulo : ""} onChange={handleInput} label="Titulo da Vaga" className=" w-full" variant="outlined" />
                            </Grid>
                            <Grid sm={9} xs={12} item className="w-full">
                                <Tooltip title="Não utilize ponto final para definir um valor, siga os seguintes exemplos: 'R$ 300,65', 'R$1200,50', 'R$10000,45', 'R$100000,60'">
                                    <TextField 
                                        label="Salario da Vaga"
                                        onChange={handleInput}
                                        className=" w-full" 
                                        variant="outlined"
                                        name="salario"
                                        value={newVacancy?.salario}
                                        disabled={newVacancy?.confidencial_salario == 1? true: false}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                        }}
                                    />
                                </Tooltip>
                            </Grid>
                                <Grid xs={12} sm={3} item >
                                    <Checkbox 
                                        checked={newVacancy?.confidencial_salario == 1? true: false} 
                                        onChange={()=>handleInput({target:{name: "confidencial_salario", value: newVacancy?.confidencial_salario == 1? 0 : 1 }} )}
                                    />
                                    <Tooltip arrow title="Caso seja marcado, o salário será OCULTADO e NÃO PODERÁ ser alterado.">
                                    <Chip 
                                        label="Confidencial?" 
                                        onClick={
                                            ()=>handleInput({target:{name: "confidencial_salario", value: newVacancy?.confidencial_salario == 1? 0 : 1 }} )}
                                        variant={newVacancy?.confidencial_salario == 1? "filled" : "outlined"}
                                    />
                                    </Tooltip>
                            </Grid>
                            <Grid item xs={12} >
                                <TextField
                                    id="outlined-multiline-static"
                                    label="Descrição"
                                    multiline
                                    onChange={handleInput}
                                    name="descricao"
                                    rows={8}
                                    className="w-full"
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} className="mt-2">
                            <Grid item xs={12} sm={newVacancy.tipo === VACANCY_TYPE.CLT? 12 : 6} >
                                <FormControl className="w-full">
                                    <InputLabel id="vacancyType">Tipo de Vaga</InputLabel>
                                        <Select
                                            name="tipo"
                                            labelId="select-tipo"
                                            label="Tipo de Vaga"
                                            value={newVacancy.tipo}
                                            onChange={handleInput}
                                        >
                                        {VACANCY_TYPE?.ARRAY.map((type:{id: number, name: string}) => (
                                            <MenuItem
                                                key={type?.id}
                                                value={type?.id}
                                            >
                                            {type?.name}
                                            </MenuItem>
                                        ))}
                                        </Select>
                                </FormControl>
                            </Grid>
                            {newVacancy.tipo === VACANCY_TYPE.CLT? null :
                            <Grid item xs={12} sm={6} >
                                <FormControl className="w-full">
                                    <InputLabel id="remuneration">REMUNERAÇÃO</InputLabel>
                                        <Select
                                            name="remunerado"
                                            labelId="select-remuneration"
                                            label="REMUNERAÇÃO"
                                            value={newVacancy.remunerado}
                                            onChange={handleInput}
                                        >
                                        {REMUNERATION?.ARRAY.map((type:{id: number, name: string}) => (
                                            <MenuItem
                                                key={type.id}
                                                value={type?.id}
                                            >
                                            {type.name}
                                            </MenuItem>
                                        ))}
                                        </Select>
                                </FormControl>
                            </Grid>}
                        </Grid>
                        <Grid container spacing={2} className="p-2 mt-2">
                            <Tooltip arrow title="Data de inicio para as inscrição na vaga.">
                                <Grid item className="justify-center-center" xs={12} sm={6}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <Stack spacing={3}>
                                            <DesktopDatePicker
                                                label="Prazo da Vaga: Início"
                                                value={startDate}
                                                views={["year", "month", "day"]}
                                                format="DD/MM/YYYY"
                                                onChange={handleChangeStartDate}
                                            />
                                        </Stack>
                                    </LocalizationProvider>
                                </Grid>
                            </Tooltip>
                            <Tooltip arrow title="Data de encerramento para as inscrições da vaga.">
                                <Grid item className="justify-center-center" xs={12} sm={6}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <Stack spacing={3}>
                                            <DesktopDatePicker
                                                label="Prazo da Vaga: Término"
                                                value={finalDate}
                                                views={["year", "month", "day"]}
                                                format="DD/MM/YYYY"
                                                onChange={handleChangeFinalDate}
                                            />
                                        </Stack>
                                    </LocalizationProvider>
                                </Grid>
                            </Tooltip>
                        </Grid>
                        <Grid container spacing={2} justifyContent="start" alignItems="center" className="p-3">
                            <Grid xs={12}  sm={3} item>
                                <Checkbox 
                                    checked={newVacancy.status == STATUS.ATIVO? true : false}
                                    onChange={()=>handleInput({target:{name:"status", value:newVacancy.status == STATUS.ATIVO? STATUS.INATIVO : STATUS.ATIVO }})}
                                    color="primary" 
                                /> 
                                <Tooltip 
                                    arrow 
                                    title="Por padrão, a vaga sempre vem ativa, mas para facilitar e não precisar excluir vagas, você pode desativar, e ativa-las novamente quando for utilizar."
                                >
                                    <Chip 
                                        label="Vaga Ativa?" 
                                        onClick={
                                            ()=>handleInput({target:{name: "status", value: newVacancy?.status == 1? 0 : 1 }} )}
                                        variant={newVacancy?.status == 1? "filled" : "outlined"}
                                    />
                                </Tooltip>          
                            
                            </Grid>
                            <Grid xs={12} sm={5} justifyContent={"center"} item>
                                    <Checkbox 
                                        checked={newVacancy.confidencial_nome == 1? true : false}
                                        onChange={()=>handleInput({target:{name:"confidencial_nome", value:newVacancy.confidencial_nome == 1? STATUS.INATIVO : STATUS.ATIVO }})}
                                        color="primary" 
                                    />
                                <Tooltip arrow title="Caso seja marcado, o salário será OCULTADO e NÃO PODERÁ ser alterado.">
                                    <Chip 
                                        label="Empesa Confidencial?" 
                                        onClick={
                                            ()=>handleInput({target:{name: "confidencial_nome", value: newVacancy?.confidencial_nome == 1? 0 : 1 }} )}
                                        variant={newVacancy?.confidencial_nome == 1? "filled" : "outlined"}
                                    />
                                </Tooltip>
                                
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} className="p-2 mt-2">
                            <Grid item className="justify-center-center" xs={12} sm={6}>
                                <Button 
                                    className="bg-green-600 w-full hover:bg-green-500 text-base text-white"
                                    onClick={()=>handleCreateVacancy()}
                                > 
                                        CRIAR VAGA
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6} >
                                <Button 
                                    className="bg-red-600 w-full hover:bg-red-800 text-base text-white"
                                    onClick={()=>console.log(newVacancy)}
                                > 
                                    CANCELAR
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            <LayoutBottom />
        </>
    )
} 