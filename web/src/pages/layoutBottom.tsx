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
        ©2014 - {new Date().getFullYear()}, Etec Rio Claro - Etec Prof. Armando Bayeux da Silva - TODOS OS DIREITOS RESERVADOS
    </Typography>
    </div>
    )
}