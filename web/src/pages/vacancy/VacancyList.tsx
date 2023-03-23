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
            <Grid container className="mb-24">
                {!loading?
                    vacancyList.map((vaga:HomeProps)=>
                        <Grid 
                            item 
                            key={vaga.id}
                            xs={12} 
                            sm={4}
                            className="flex justify-center mt-12" 
                        >
                            <Paper className="bg-white h-128 w-384" >
                                <Typography  className='text-center p-1 text-2xl'>
                                    {vaga.titulo}
                                </Typography>
                                <Divider />
                                <Grid container>
                                    <Grid item className="p-2 mx-2 ">
                                        {vaga.salario?
                                        <Tooltip arrow title={"R$ "+vaga.salario} className='mt-1.5'>
                                            <CurrencyCircleDollar size={26} className='hover:text-zinc-600 text-zinc-900 w-auto ' weight="bold"/>
                                        </Tooltip>
                                        :
                                        <Tooltip arrow title="Confidencial" className='mt-1.5'>
                                        <CurrencyCircleDollar size={26} className='hover:text-zinc-600 text-zinc-900 w-auto ' weight="bold"/>
                                        </Tooltip>
                                        }
                                    </Grid>
                                    <Grid item className="p-2 mx-2">
                                        {vaga.Empresas?.nome_fantasia?
                                        <Tooltip arrow title={"Empresa: "+vaga?.Empresas?.nome_fantasia} className='mt-1.5'>
                                            <Buildings size={26} className='hover:text-zinc-600 text-zinc-900 w-auto ' weight="bold"/>
                                        </Tooltip>
                                        :
                                        <Tooltip arrow title="Empresa Confidencial" className='mt-1.5'>
                                        <Buildings size={26} className='hover:text-zinc-600 text-zinc-900 w-auto ' weight="bold"/>
                                        </Tooltip>
                                        }
                                    </Grid>
                                </Grid>
                                    <Divider/>
                                <Typography  className='text-base text-justify p-2 h-72/100'>
                                    {vaga.descricao? vaga.descricao : "Nenhuma Descrição foi informada sobre a vaga."}
                                </Typography>
                                <Divider />
                                <Grid container  >
                                    <Grid item className="py-1.5 px-8" xs={8}>
                                        <Button onClick={()=>console.log(vaga)} size='large' variant="outlined" className='border rounded-md border-EtecGrayText hover:border-zinc-800  hover:bg-blue-400 text-base bg-blue-600 text-EtecLightGray hover:text-white'>
                                                Ver mais
                                        </Button>
                                    </Grid>
                                    <Grid xs={1}/>
                                    <Grid item className="p-2" xs={3}>
                                        <Tooltip title="Aplicar a vaga" arrow>
                                            <Button className="rounded-xl">
                                                <PlusCircle size={26} className='hover:text-zinc-600 text-zinc-900 w-auto ' weight="bold" />
                                            </Button>
                                        </Tooltip>
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
        <LayoutBottom />
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