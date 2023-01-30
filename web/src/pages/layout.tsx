
import { 
    Drawer, Button, Avatar, Grid, Box
 } from '@mui/material'
import { useState } from 'react'

export default function Layout(){
    const [drawerStatus, setDrawerStatus] = useState(false)
    
    const handleOpenDrawer = ((e: boolean)=>{
        setDrawerStatus(e)
    })

    return (
        <div>
            <Grid container>
                <Grid container className='w-full max-w-3lx mx-auto bg-zinc-700 flex'>
                    <div className='item items-start'>
                        <Button onClick={()=> handleOpenDrawer(true)}>
                            Drawer
                        </Button>
                        <Drawer
                            open={drawerStatus}
                            onClose={()=> setDrawerStatus(false)}
                        >
                            <div>

                            </div>
                        </Drawer>
                    </div>
                    <div className='left-0' >
                        <Avatar alt="User Avatar" src="https://github.com/CasemiroSJunior.png" />
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}