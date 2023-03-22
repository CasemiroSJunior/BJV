import { Button, Divider, Grid, Paper, Skeleton, Tooltip, Typography } from "@mui/material";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useEffect, useState } from "react";
import Layout from "../layout";
import LayoutBottom from "../layoutBottom";
import { Buildings, CurrencyCircleDollar, PlusCircle } from 'phosphor-react'

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
    const [loading, setLoading] = useState<boolean>(true)



    useEffect(()=>{
        console.log(data)
        let vacanciesTemp = [];
        data?.vacancies.map((e: HomeProps ) => e.status === 1? vacanciesTemp.push(e) : null)
        setVacancyList(vacanciesTemp)
        vacanciesTemp.length === 0?
        null:
        setLoading(false)
    },[data])

    return (
        <>
        <Layout/>
            <Grid container>
                {!loading?
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
                                <Grid container >
                                    <Grid item className="p-2 mx-2">
                                        {vaga.salario?
                                        <Tooltip title={"R$ "+vaga.salario} className='mt-1.5'>
                                            <CurrencyCircleDollar size={26} className='hover:text-zinc-600 text-zinc-900 w-auto ' weight="bold"/>
                                        </Tooltip>
                                        :
                                        <Tooltip title="Confidencial" className='mt-1.5'>
                                        <CurrencyCircleDollar size={26} className='hover:text-zinc-600 text-zinc-900 w-auto ' weight="bold"/>
                                        </Tooltip>
                                        }
                                    </Grid>
                                    <Grid item className="p-2 mx-2">
                                        {vaga.salario?
                                        <Tooltip title={"Empresa: "+vaga.salario} className='mt-1.5'>
                                            <Buildings size={26} className='hover:text-zinc-600 text-zinc-900 w-auto ' weight="bold"/>
                                        </Tooltip>
                                        :
                                        <Tooltip title="Empresa Confidencial" className='mt-1.5'>
                                        <Buildings size={26} className='hover:text-zinc-600 text-zinc-900 w-auto ' weight="bold"/>
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
                    <>
                        <Grid item xs={6} md={4} className='p-6'>
                            <Paper className="bg-white">
                                <Skeleton
                                    sx={{ bgcolor: 'grey.900' }}
                                    variant="rounded"
                                    height={200}
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={6} md={4} className='p-6'>
                            <Paper className="bg-white">
                                <Skeleton
                                    sx={{ bgcolor: 'grey.900' }}
                                    variant="rounded"
                                    height={200}
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={6} md={4} className='p-6'>
                            <Paper className="bg-white">
                                <Skeleton
                                    sx={{ bgcolor: 'grey.900' }}
                                    variant="rounded"
                                    height={200}
                                />
                            </Paper>
                        </Grid>
                    </>
                }
            </Grid>
        <LayoutBottom/>
        </>
    )
} 

export const getStaticProps: GetStaticProps = async() =>{
    try {
        const response = await fetch('http://localhost:3107/vacancies');
        const data = await response.json();
    
    
        return{        
            props:{
                data: data,
                date: new Date().toISOString()
            },
            revalidate: 60*60*4,
        } 
    } catch (error) {
        return {props:{
            data: null,
            date: new Date().toISOString()
        }}
    }
}