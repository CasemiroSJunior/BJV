import { useState } from 'react';
import { Box, Button, CardActions, CardContent, Card, Typography, TextField } from "@mui/material";
import * as yup from "yup";
import { useAuthContext } from '@/components/AuthContext';

interface ILoginProps {
    children: React.ReactNode;
}

const loginSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required().min(5),
})



export function Login(children){
    const { login, isAuthenticated  } = useAuthContext;
   
    const [isLoading, setIsLoading] = useState(false); 

    const [password, setPassword] = useState(''); 
    const [email, setEmail] = useState('');    
    const [passwordError, setPasswordError] = useState(''); 
    const [emailError, setEmailError] = useState('');    

    const handleSubmit = () => {
        loginSchema.validate({ email, password}).then(dadosValidados=>{
            login(dadosValidados.email, dadosValidados.password);
        }).catch((errors: yup.ValidationError)=>{

            errors.inner.forEach(e=>{
                if (e.path === "email"){
                    setEmailError(e.message)
                }
                if (e.path === "passowrd"){
                    setPasswordError(e.message)
                }
            })
        })
    };
    
    if (isAuthenticated) return (
        <>{children}</>
    );
    return (
        <Box width= '100vw' height='100vh' display="flex" alignItems='center' justifyContent='center'>
            
            <Card>
                <CardContent>
                    <Box display='flex' flexDirection='column' gap={2} width={250}>
                        <Typography variant='h6' align='center'>Identifique-se</Typography>

                        <TextField
                            fullWidth
                            label='Email'
                            type='email'
                            value={email}
                            disabled={isLoading}
                            error={!!emailError}
                            helperText={emailError}
                            onKeyDown={e => setEmailError('')}
                            onChange={e => setEmail(e.target.value)}
                           
                        />
                        <TextField
                            fullWidth
                            label='Senha'
                            type='password'
                            value={password}
                            disabled={isLoading}
                            error={!!passwordError}
                            helperText={passwordError}
                            onKeyDown={e => setPasswordError('')}
                            onChange={e => setPassword(e.target.value)}
                           
                        />
                    </Box>
                </CardContent>
                <CardActions>
                    <Box width='100%' display='flex' justifyContent='center'>
                        <Button 
                            variant='contained'
                            className=''
                            disabled={isLoading}
                            onClick={handleSubmit}
                            endIcon={isLoading ? <CircularProgress variant='indeterminate' color='inherit' size={20} /> : undefined}
                        >
                          Entrar
                        </Button>
                    </Box>
                </CardActions>
            </Card>

        </Box>
    );
}; 