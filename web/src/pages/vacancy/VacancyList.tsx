import { Button, Card, CircularProgress, Dialog, DialogContent, DialogTitle, Divider, Grid, Paper, Skeleton, Snackbar, Tooltip, Typography } from "@mui/material";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useEffect, useState } from "react";
import Layout from "../layout";
import LayoutBottom from "../layoutBottom";
import { Buildings, CurrencyCircleDollar, PlusCircle } from 'phosphor-react'
import { api } from "@/lib/axios";

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

interface VacancyInfoProps{
    showDialog: boolean;
    setShowDialog: (showDialog: boolean)=> void;
    closeDialog: ()=> void;
    data: HomeProps;
}

export function VacancyInfo(props: VacancyInfoProps){
    const {showDialog, setShowDialog, closeDialog,data, ...other} = props;
    return(
        showDialog === true?
        
        <Dialog open={showDialog} fullWidth onClose={closeDialog}>
            <DialogTitle>{data?.titulo}</DialogTitle>
            <Divider/>
            <DialogContent>
                <div>
                    <Card variant="outlined">
                        <Grid container>
                            <Grid>
                                <Button> Candidatar-se</Button>
                            </Grid>
                            <Grid>
                                <Button onClick={closeDialog}>Fechar</Button>
                            </Grid>
                        </Grid>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
        : null)
}

export default function Vacancy( ) {

    const [vacancyList, setVacancyList] = useState([])
    const [vacancyListFiltered, setVacancyListFiltered] = useState([])
    const [loading, setLoading] = useState<boolean>(true)
    const [showDialog, setShowDialog ] = useState<boolean>(false);
    const [vacancyData, setVacancyData]= useState([])

    const handleCloseDialog= ()=>{
        setShowDialog(false)
    }

    const handleOpenDialog= (data:[])=>{
        setVacancyData(data)
        setShowDialog(true)
        

    }

    useEffect( ()=>{
        api.get('vacancies').then(response=> { setVacancyList(response.data)})
        
    },[])

    useEffect( ()=>{
        let vacanciesTemp:[] = [];
        vacancyList?.vacancies?.map((e: HomeProps ) => e.status === 1? vacanciesTemp.push(e) : null)
        setVacancyListFiltered(vacanciesTemp)
        setLoading(false)
    },[vacancyList])

    const handleVacancySubscribe= async(alunoId:number, vacancyId:number)=>{
        try{
            await api.post('vacancy/sub',{
                alunoId,
                vacancyId
            })

            alert("Inscrição feita com sucesso!")
        }catch (error){
            return alert("Erro na Inscrição- COD: VSUB-001")
        }
    }

    return (
        <>
        <Layout/>
            <Grid container className="mb-24">
                {!loading?
                    vacancyListFiltered.map((vaga:HomeProps)=>
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
                                        {vaga.confidencial_salario === 0?
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
                                        {vaga.confidencial_nome === 0?
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
                                        <Button onClick={()=>handleOpenDialog(vaga)} size='large' variant="outlined" className='border rounded-md border-EtecGrayText hover:border-zinc-800  hover:bg-blue-400 text-base bg-blue-600 text-EtecLightGray hover:text-white'>
                                                Ver mais
                                        </Button>
                                    </Grid>
                                    <Grid item xs={1}/>
                                    <Grid item className="p-2" xs={3}>
                                        <Tooltip title="Aplicar a vaga" arrow>
                                            <Button className="rounded-xl" onClick={()=>handleVacancySubscribe(1, 2)}>
                                                <PlusCircle size={26} className='hover:text-zinc-600 text-zinc-900 w-auto ' weight="bold"  />
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
            <VacancyInfo
                showDialog={showDialog}
                closeDialog={handleCloseDialog}
                data={vacancyData}
            />
        <LayoutBottom />
        </>
    )
} 

/* export const getStaticProps: GetStaticProps = async() =>{
    try {
        var Data
        await api.get('vacancies').then(response => {  Data = response.data })
        
        return{        
            props:{
                data: Data,
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
} */