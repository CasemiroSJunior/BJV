import { Button, Checkbox, Chip, Divider, Grid, InputAdornment, Paper, Skeleton, TextField, Tooltip, Typography } from "@mui/material";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useEffect, useState } from "react";
import Layout from "../layout";
import LayoutBottom from "../layoutBottom";
import { Buildings, CurrencyCircleDollar, PlusCircle } from 'phosphor-react'

export default function VacancyRegister() {
    const [confidentialSalary, setConfidentialSalary] = useState(false) 
    const [confidentialName, setConfidentialName] = useState(false) 
    

    return (
        <>
            <Layout />
            <Grid container className="mb-24 justify-center mt-12">
                <Paper className="bg-white  " >
                    <Grid container xl>
                        <Grid xs={8} item className="p-2">
                            <TextField label="Titulo da Vaga" className=" w-1/2" variant="outlined" />
                        </Grid>
                        <Grid xs={8} item className="p-2">
                            <TextField 
                                label="Salario da Vaga" 
                                className=" w-1/2" 
                                variant="outlined"
                                disabled={confidentialSalary}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                  }}
                            />
                            
                            <Checkbox onChange={()=>setConfidentialSalary(!confidentialSalary)} />
                            <Chip label="Confidencial?" 
                                variant={confidentialSalary? "filled" : "outlined"}
                                
                            />
                        </Grid>
                        <Grid item xs={12} className="p-2">
                        <TextField
                            id="outlined-multiline-static"
                            label="Descrição"
                            multiline
                            rows={8}
                            className=" w-1/2"
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <LayoutBottom />
        </>
    )
} 