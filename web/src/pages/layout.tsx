import { 
    Drawer, Button, Avatar, Box, AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Grid, BottomNavigation, DialogTitle, DialogContent, Dialog, Alert, Snackbar
 } from '@mui/material'
import Link from 'next/link';
import { ArrowLineRight, ArrowLineLeft, X } from 'phosphor-react';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';



interface LogoutDialogProps{
    showDialog: boolean;
    setShowDialog: (showDialog: boolean)=> void;
    closeDialog: ()=> void;
    disconnect: ()=> void;
}

export function LogoutDialog(props: LogoutDialogProps){
    const {showDialog, setShowDialog, closeDialog, disconnect, ...other} = props;
    


    return(
        showDialog === true?
        
        <Dialog open={showDialog} onClose={closeDialog}>
            <DialogTitle>Deseja realmente desconectar?</DialogTitle>
            <DialogContent>
                <div>
                    <Grid container>
                        <Grid>
                            <Button onClick={disconnect}> Sair</Button>
                        </Grid>
                        <Grid>
                            <Button onClick={closeDialog}>Cancelar</Button>
                        </Grid>
                    </Grid>
                </div>
            </DialogContent>
        </Dialog>
        : null)
}



export default function Layout(){
    const router = useRouter();

    const [drawerStatus, setDrawerStatus] = useState(false);
    const [auth, setAuth] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [showDialog, setShowDialog ] = useState<boolean>(false);
    const [snackbarStatus ,setSnackbarStatus] = useState<boolean>(false)
    
    const handleOpenDrawer = ((e: boolean)=>{
        setDrawerStatus(e)
    })

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
    setAnchorEl(null);
    };
      
    const handleSnackBarClose = () =>{
        setSnackbarStatus(false)
    }

    const handleDisconnect = () =>{
    setAnchorEl(null);
    setAuth(false);
    setShowDialog(false);
    router.push("/")
    }

    const handleOpenLogoutDialog= ()=>{
    setShowDialog(true)
    setAnchorEl(null);
    }

    const handleCloseDialog= ()=>{
    setShowDialog(false)
    }

    const handleDrawerUse = (event:string)=>{
        console.log(event)
        if(auth) {
            if(event === "profile") router.push('/users/userCreate');
            if(event === "vacancy") router.push('/vacancy/VacancyList');
            if(event === "tips") router.push('/misc/Advices');
            if(event === "newVacancy") router.push('/vacancy/VacancyRegister');
            if(event === "userManage") router.push('/users/AdminPanel');
        }else{
            setSnackbarStatus(true)
        }
    }

    return (
        <>
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" className='bg-DefaultRedEtec'>
                <Toolbar>
                    <div>
                        <Button onClick={()=> handleOpenDrawer(true)} >
                            <ArrowLineRight size={26} weight="bold" 
                            className='hover:text-zinc-700 text-zinc-900 w-auto h-auto'/>
                        </Button>
                        <Drawer
                            open={drawerStatus}
                            onClose={()=> setDrawerStatus(false)}
                        >   <>
                            <div className='bg-DefaultRedBoldEtec h-full'>
                                <Button onClick={()=> handleOpenDrawer(false)} className='mt-2 hover:text-zinc-700 hover:bg-DefaultHoverBoldEtec mx-2 hover:border-zinc-800 rounded-xl'  >
                                    <ArrowLineLeft size={26} weight="bold" 
                                    className='hover:text-zinc-700 text-zinc-900 w-auto h-auto'/>
                                </Button>
                                <Grid className='mt-4'>
                                    <Grid alignContent='center'>
                                        <Grid>
                                            <Button onClick={()=>handleDrawerUse('profile')} name='profile' size='large' variant="outlined" className='w-52 mt-2 space-x-2 border rounded-lg p-2 m-3 border-EtecGrayText hover:border-zinc-800  hover:bg-DefaultHoverBoldEtec text-base text-EtecLightGray hover:text-white'>
                                                Perfil
                                            </Button>
                                        </Grid>
                                        <Grid>
                                            <Button  onClick={()=>handleDrawerUse('vacancy')} name='vacancy'size='large' variant="outlined" className='w-52 mt-2 space-x-2 border rounded-lg p-2 m-3 border-EtecGrayText hover:border-zinc-800  hover:bg-DefaultHoverBoldEtec text-base text-EtecLightGray hover:text-white'>
                                                Vagas
                                            </Button>
                                        </Grid>
                                            <Grid>
                                            <Button  onClick={()=>handleDrawerUse('tips')} name='tips'size='large' variant="outlined" className='w-52 mt-2 space-x-2 border rounded-lg p-2 m-3 border-EtecGrayText hover:border-zinc-800  hover:bg-DefaultHoverBoldEtec text-base text-EtecLightGray hover:text-white'>
                                                Conselhos
                                            </Button>
                                        </Grid>
                                            <Grid>
                                            <Button  onClick={()=>handleDrawerUse('newVacancy')} name='newVacancy'size='large' variant="outlined" className='w-52 mt-2 space-x-2 border rounded-lg p-2 m-3 border-EtecGrayText hover:border-zinc-800  hover:bg-DefaultHoverBoldEtec text-base text-EtecLightGray hover:text-white'>
                                                Cadastrar vagas
                                            </Button>
                                        </Grid>
                                            <Grid>
                                            <Button  onClick={()=>handleDrawerUse('userManage')} name='userManage'size='large' variant="outlined" className='w-52 mt-2 space-x-2 border rounded-lg p-2 m-3 border-EtecGrayText hover:border-zinc-800  hover:bg-DefaultHoverBoldEtec text-base text-EtecLightGray hover:text-white'>
                                                Gerenciar usuários
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Snackbar
                                    anchorOrigin={{vertical:'top', horizontal: 'center'}}
                                    onClose={handleSnackBarClose}
                                    open={snackbarStatus}
                                    autoHideDuration={8000}
                                >
                                    <Grid >
                                        <Alert severity='warning'>
                                            Você precisa fazer Login antes de mudar de página. 
                                            <Button className='p-2 ml-2 text-zinc-800' onClick={()=>setSnackbarStatus(false)}><X weight='bold'/></Button>
                                        </Alert>
                                    </Grid>
                                </Snackbar>
                            </div>
                        </>
                        </Drawer>
                    </div>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    </Typography>
                    {auth ? (
                        <div>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <div className='left-0' >
                                <Avatar alt="User Avatar" src="https://github.com/CasemiroSJunior.png" />
                            </div>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>Profile</MenuItem>
                            <MenuItem onClick={handleClose}>My account</MenuItem>
                            <MenuItem onClick={handleOpenLogoutDialog}>Desconectar</MenuItem>
                        </Menu>
                        </div>
                    ):
                    <div>
                        <div className='mx-0 border rounded-full p-1 border-zinc-900 bg-zinc-800 hover:bg-zinc-900 text-white hover:text-EtecLightGray w-full h-full'>
                            <Button className='text-base text-white hover:text-EtecLightGray w-full h-full'
                            onClick={()=>setAuth(true)}
                            >
                                ENTRAR
                            </Button>
                        </div>
                    </div>}
                </Toolbar>
            </AppBar>
        </Box>
        <LogoutDialog
            setShowDialog={handleClose}
            showDialog={showDialog}
            closeDialog={handleCloseDialog}
            disconnect={handleDisconnect}
        />
    </>
    )
}