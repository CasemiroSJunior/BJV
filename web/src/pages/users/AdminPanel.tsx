import { useState } from 'react'
import { 
    Avatar,
    Grid, Paper
 } from "@mui/material";
import Layout from "../layout";
import LayoutBottom from "../layoutBottom";
import { api } from "@/lib/axios";



export default function AdminPanel() {

    const [users, setUsers] = useState([])

    return (
        <>
            <Layout />
            <Grid container className="mb-24 mt-12 justify-center">
                <Paper className="w-full h-full">
                    
                </Paper>
            </Grid>
            <LayoutBottom />
        </>
    )
} 