import { Button, Divider, Grid, Paper, Tooltip, Typography } from "@mui/material";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useEffect, useState } from "react";
import Layout from "../layout";
import LayoutBottom from "../layoutBottom";
import { CurrencyCircleDollar, PlusCircle } from 'phosphor-react'

 interface HomeProps{
        id: number;
        titulo: string;
        descricao: string;
        salario: number;
        remunerado: number;
        tipo: number;
        status: number;
        data_inicio: string;
        data_termino: string;
        created_At: string;
        updated_At: string;
}

export default function Vacancy({ data }) {

    const [vacancyList, setVacancyList] = useState([])

    useEffect(()=>{
        let vacanciesTemp = [];
        data.vacancies.map((e: HomeProps ) => e.status === 1? vacanciesTemp.push(e) : null)
        setVacancyList(vacanciesTemp)
    },[data])

    return (
        <>
        <Layout/>
            <Grid container>
                {vacancyList?
                    vacancyList.map((vaga:HomeProps)=>
                        <Grid 
                            item 
                            key={vaga.id}
                            xs={12} 
                            sm={4}
                            className="p-6"
                        >
                            <Paper className="bg-white">
                                <Typography  className='text-center p-1 text-2xl'>
                                    {vaga.titulo}
                                </Typography>
                                <Divider />
                                <Typography  className='text-base text-justify p-2 '>
                                    {vaga.descricao? vaga.descricao : "Nenhuma Descrição foi informada sobre a vaga."}
                                </Typography>
                                <Divider />
                                <Grid container xs={6}>
                                    <Grid item className="p-2 mx-2">
                                        {vaga.salario?
                                        <Tooltip title={"R$ "+vaga.salario} >
                                            <CurrencyCircleDollar size={26} className='hover:text-zinc-600 text-zinc-900 w-auto ' weight="bold"/>
                                        </Tooltip>
                                        :
                                        <Tooltip title="Valor não informado">
                                        <CurrencyCircleDollar size={26} className='hover:text-zinc-600 text-zinc-900 w-auto ' weight="bold"/>
                                        </Tooltip>
                                        }
                                    </Grid>
                                    <Grid item className="p-2" xs={6}>
                                        <Button className="rounded-xl">
                                            <PlusCircle size={26} className='hover:text-zinc-600 text-zinc-900 w-auto ' weight="bold" />
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    ):
                null
                }
            </Grid>



        <LayoutBottom/>
        </>
    )
} 

export const getStaticProps: GetStaticProps = async() =>{
    const response = await fetch('http://localhost:3107/vacancies');
    const data = await response.json();


    return{        
        props:{
            data: data,
            date: new Date().toISOString()
        },
        revalidate: 60*60*4,
    }
}