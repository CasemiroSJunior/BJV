import {useState, useEffect} from 'react';
import {
    Typography,Grid,Box, Button,
} from "@mui/material";

import { api } from "@/lib/axios";
import Layout from '../layout';
import LayoutBottom from '../layoutBottom';

export default function Advices() {
    
    return (
        <>
            <Layout/>
            <Grid container>
            <Button 
                size='large' 
                variant="outlined" 
                className='
                    border
                    rounded-md 
                    border-EtecGrayText
                    hover:border-zinc-800
                    hover:bg-blue-400 
                    text-base 
                    bg-blue-600 
                    text-EtecLightGray 
                    hover:text-white
                '
            >
                Adicionar Material
            </Button>
            </Grid>
            <LayoutBottom/>
        </>
    )
} 