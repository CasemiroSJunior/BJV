import { Grid, Paper, Typography } from "@mui/material";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useEffect, useState } from "react";
import Layout from "../layout";
import LayoutBottom from "../layoutBottom";

 interface HomeProps{
        id: number;
        titulo: string;
        descricao: string;
        salario: number;
        remunerado: number;
        tipo: number;
        status: number;
        data_inicio: Date;
        data_termino: Date;
        created_At: Date;
        updated_At: Date;
}

export default function Vacancy({ data, date }) {

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
                            sm={6}
                            className="p-6"
                        >
                            <Paper className="bg-white">
                                <Typography  className='text-base text-center'>
                                    {vaga.titulo}
                                </Typography>
                                <Typography  className='text-base text-center'>
                                    {vaga.descricao}
                                </Typography>
                                <Typography  className='text-base text-center'>
                                    {vaga.salario}
                                </Typography>
                                <Typography  className='text-base text-center'>
                                    De {vaga.data_inicio} até {vaga.data_termino}
                                </Typography>
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