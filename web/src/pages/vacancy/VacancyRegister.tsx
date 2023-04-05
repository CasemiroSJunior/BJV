import { Box, Button, Checkbox, Chip, FormControl, FormControlLabel, Grid, InputAdornment, InputLabel, MenuItem, OutlinedInput, Paper, Select, Stack, Switch, TextField, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Layout from "../layout";
import LayoutBottom from "../layoutBottom";
import { REMUNERATION, STATUS, VACANCYTYPE } from "@/config/constants";
import { LocalizationProvider, DesktopDatePicker  } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

export default function VacancyRegister() {
    
    const NEW_VACANCY = {
        titulo : null,
        descricao : null,
        salario: 0,
        tipo: VACANCYTYPE.ESTAGIO,
        remunerado: STATUS.ATIVO,
        confidencial_nome: STATUS.INATIVO,
        confidencial_salario: STATUS.INATIVO,
        status: STATUS.ATIVO,
        empresasUsersId: 1,
        data_inicio: null,
        data_termino: null,
    };
    
    const [newVacancy, setNewVacancy] = useState(NEW_VACANCY);
    const [startDate, setStartDate] = useState<Dayjs | null>(dayjs(new Date()),);
    const [finalDate, setFinalDate] = useState<Dayjs | null>(dayjs(new Date()),);

    const handleConfidential = (event: { target: { name: string; value: any; }; }) =>{
        let { name, value } = event.target;
        let TempVacancy=({...newVacancy, [name]: value})
        console.log(TempVacancy)
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
                                <TextField name="titulo" value={newVacancy?.titulo? newVacancy.titulo : ""} onChange={handleConfidential} label="Titulo da Vaga" className=" w-full" variant="outlined" />
                            </Grid>
                            <Grid sm={9} xs={12} item className="w-full">
                                <TextField 
                                    label="Salario da Vaga"
                                    onChange={handleConfidential}
                                    className=" w-full" 
                                    variant="outlined"
                                    name="salario"
                                    value={newVacancy?.salario}
                                    disabled={newVacancy?.confidencial_salario == 1? true: false}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                    }}
                                />
                            </Grid>
                                <Grid xs={12} sm={3} item >
                                    <Checkbox 
                                        checked={newVacancy?.confidencial_salario == 1? true: false} 
                                        onChange={()=>handleConfidential({target:{name: "confidencial_salario", value: newVacancy?.confidencial_salario == 1? 0 : 1 }} )}
                                    />
                                    <Tooltip arrow title="Caso seja marcado, o salário será OCULTADO e NÃO PODERÁ ser alterado.">
                                    <Chip 
                                        label="Confidencial?" 
                                        onClick={
                                            ()=>handleConfidential({target:{name: "confidencial_salario", value: newVacancy?.confidencial_salario == 1? 0 : 1 }} )}
                                        variant={newVacancy?.confidencial_salario == 1? "filled" : "outlined"}
                                    />
                                    </Tooltip>
                            </Grid>
                            <Grid item xs={12} >
                                <TextField
                                    id="outlined-multiline-static"
                                    label="Descrição"
                                    multiline
                                    rows={8}
                                    className="w-full"
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} className="mt-2">
                            <Grid item xs={12} sm={6} >
                                <FormControl className="w-full">
                                    <InputLabel id="vacancyType">Tipo de Vaga</InputLabel>
                                        <Select
                                            name="tipo"
                                            labelId="select-tipo"
                                            label="Tipo de Vaga"
                                            value={newVacancy.tipo}
                                            onChange={handleConfidential}
                                        >
                                        {VACANCYTYPE?.ARRAY.map((type) => (
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
                            <Grid item xs={12} sm={6} >
                                <FormControl className="w-full">
                                    <InputLabel id="remuneration">REMUNERAÇÃO</InputLabel>
                                        <Select
                                            name="remunerado"
                                            labelId="select-remuneration"
                                            label="REMUNERAÇÃO"
                                            value={newVacancy.remunerado}
                                            onChange={handleConfidential}
                                        >
                                        {REMUNERATION?.ARRAY.map((type) => (
                                            <MenuItem
                                                key={type.id}
                                                value={type.id}
                                            >
                                            {type.name}
                                            </MenuItem>
                                        ))}
                                        </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} className="p-2 mt-2">
                            <Grid item className="justify-center-center" xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Stack spacing={3}>
                                        <DesktopDatePicker
                                            label="Data de Início"
                                            value={startDate}
                                            views={["year", "month", "day"]}
                                            format="DD/MM/YYYY"
                                            onChange={handleChangeStartDate}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </Stack>
                                </LocalizationProvider>
                            </Grid>
                            <Grid item className="justify-center-center" xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Stack spacing={3}>
                                        <DesktopDatePicker
                                            label="Data de Termino"
                                            value={finalDate}
                                            views={["year", "month", "day"]}
                                            format="DD/MM/YYYY"
                                            onChange={handleChangeFinalDate}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </Stack>
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} justifyContent="start" alignItems="center" className="p-3">
                            <Grid xs={12}  sm={3} item>
                                <Checkbox 
                                    checked={newVacancy.status == 1? true : false}
                                    onChange={()=>handleConfidential({target:{name:"status", value:newVacancy.status == 1? STATUS.INATIVO : STATUS.ATIVO }})}
                                    color="primary" 
                                /> 
                                <Tooltip 
                                    arrow 
                                    title="Por padrão, a vaga sempre vem ativa, mas para facilitar e não precisar excluir vagas, você pode desativar, e ativa-las novamente quando for utilizar."
                                >
                                    <Chip 
                                        label="Vaga Ativa?" 
                                        onClick={
                                            ()=>handleConfidential({target:{name: "status", value: newVacancy?.status == 1? 0 : 1 }} )}
                                        variant={newVacancy?.status == 1? "filled" : "outlined"}
                                    />
                                </Tooltip>          
                            
                            </Grid>
                            <Grid xs={12} sm={5} justifyContent={"center"} item>
                                    <Checkbox 
                                        checked={newVacancy.confidencial_nome == 1? true : false}
                                        onChange={()=>handleConfidential({target:{name:"confidencial_nome", value:newVacancy.confidencial_nome == 1? STATUS.INATIVO : STATUS.ATIVO }})}
                                        color="primary" 
                                    />
                                <Tooltip arrow title="Caso seja marcado, o salário será OCULTADO e NÃO PODERÁ ser alterado.">
                                    <Chip 
                                        label="Empesa Confidencial?" 
                                        onClick={
                                            ()=>handleConfidential({target:{name: "confidencial_nome", value: newVacancy?.confidencial_nome == 1? 0 : 1 }} )}
                                        variant={newVacancy?.confidencial_nome == 1? "filled" : "outlined"}
                                    />
                                </Tooltip>
                                
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} className="p-2 mt-2">
                            <Grid item className="justify-center-center" xs={12} sm={6}>
                                <Button 
                                    className="bg-green-600 w-full hover:bg-green-500 text-base text-white"
                                    onClick={()=>console.log(newVacancy)}
                                > 
                                        CRIAR VAGA
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6} >
                                <Button 
                                    className="bg-red-600 w-full hover:bg-red-800 text-base text-white"
                                    onClick={()=>console.log(startDate)}
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