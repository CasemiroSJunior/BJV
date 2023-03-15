import { Typography } from "@mui/material";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useEffect, useState } from "react";

 interface HomeProps{
    data: {
        id: number;
        titulo: string;
        descricao: string;
        salario: number;
        status: number;
        data_inicio: Date;
        data_termino: Date;
        created_At: Date;
        updated_At: Date;
    }[];
}

export default function Vacancy({ data, date }) {
    return (
        <>
            <Typography onClick={()=>console.log(data)}>{date}</Typography>
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