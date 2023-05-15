import { 
    Typography
 } from '@mui/material'

export default function LayoutBottom(){

return (
    <div
    className='bg-DefaultRedEtec w-full h-16 fixed left-0 bottom-0'
    >
    <Typography 
        className='justify-center text-center text-base text-white p-8'
    >
         ETEC Rio Claro - ETEC Prof. Armando Bayeux da Silva - PROJETO DE TCC {new Date().getFullYear()}
    </Typography>
    </div>
    )
}