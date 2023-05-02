import { ChangeEvent, useState } from "react";
import axios from "axios";
import dayjs, { Dayjs } from 'dayjs';
import {
  TextField,
  Button,
  Typography,
  Link,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
  Tooltip,
  Stack,
  InputAdornment,
  IconButton,
} from "@mui/material"

import * as helper from "../../utils/Helper"

import { useRouter } from "next/router";
import Layout from "../layout";
import LayoutBottom from "../layoutBottom";
import { STATUS, USER_TYPE } from "@/config/constants";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Eye, EyeClosed } from "phosphor-react";

interface Users {
  nome?: string,
  tipo: number | null,
  cpf?: string,
  email?: string, 
  celular?: string,
  telefone?: string,
  status: number,
  rm?: number | null,
  cnpj?: string,
  nome_fantasia?: string,
  senha: string | null,
}

export default function Register() {
  const [name, setName] = useState("");
  const [emailConfirmation, setEmailConfirmation] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [dataNascimento, setDataNascimento] = useState<Dayjs | null>(dayjs(new Date()),);
  const [error, setError] = useState("");
  const [passwordHidden, setPasswordHidden] = useState<boolean>(true)
  const router = useRouter();
  
  const NEW_USER = {
    senha: null,
    tipo: null,
    status: STATUS.INATIVO,
    email: "",
    celular: "",
  }
  
  const [userData, setUserData]= useState<Users>(NEW_USER);

  const NEW_USER_FUNCIONARIO = {
    ...NEW_USER,
    nome: "",
    cpf: "",
    tipo: USER_TYPE.FUNCIONARIO,
    cnpj: "",
    rm: null,
  };

  const NEW_USER_ALUNO = {
    ...NEW_USER,
    nome: "",
    rm: null,
    data_nascimento: "",
    cpf: "",
    telefone: "",
    tipo: USER_TYPE.ALUNO,
    cnpj: "",
  }

  const NEW_USER_EMPRESA = {
    ...NEW_USER,
    nome_fantasia: "",
    cnpj: "",
    telefone:"",
    tipo: USER_TYPE.EMPRESA,
    rm: null,
    data_nascimento: "",
  }

  const handleChangeUserType = (event:any) =>{
    if (event.target.value === USER_TYPE.ALUNO){
      setUserData({...NEW_USER_ALUNO})
      ;
    }
    if (event.target.value === USER_TYPE.EMPRESA){
      setUserData({...NEW_USER_EMPRESA})
    }
    if (event.target.value === USER_TYPE.FUNCIONARIO){
      setUserData({...NEW_USER_FUNCIONARIO})
      ;
    }
    setEmailConfirmation("")
    setPasswordConfirmation("")
    setDataNascimento(dayjs(new Date()))
    setPasswordHidden(true)
  }

  const handleClickShowPassword = () => {
    setPasswordHidden(!passwordHidden);
  };

  const handleResetData = ()=>{
    setUserData(NEW_USER)
    setEmailConfirmation("")
    setPasswordConfirmation("")
    setDataNascimento(dayjs(new Date()))
    
  }

  const handleInputData = (data: {target :{ name:string; value: any;}; })=>{
    let {name, value } = data.target
    if (name === "cpf") value = helper.cpf(data.target.value)
    if (name === "cnpj") value = helper.cnpj(data.target.value)
    if (name === "celular") value = helper.cell(data.target.value)
    if (name === "telefone") value = helper.tell(data.target.value)
    
    let dataTemp = {...userData, [name]: value}
    console.log(dataTemp)
    setUserData(dataTemp)

  }

  /* 
    Procurando tipagem para o event, referência:
      https://stackoverflow.com/questions/40676343/typescript-input-onchange-event-target-value
  
  */
  const handleSetPasswordValidation = (e: React.ChangeEvent<HTMLTextAreaElement>) =>{
    setPasswordConfirmation(e.target.value)
  }

  const handleSetEmailValidation = (e: ChangeEvent<HTMLTextAreaElement>) =>{
    setEmailConfirmation(e.target.value)
  }

  const handleDateOfBirth = (date:Dayjs | null)=>{
    setDataNascimento(date)
}

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/register", { name, email, password });
      if (res.data.success) {
        router.push("/login");
      }
    } catch (err:any) {
      setError(err.response.data.message);
    }
  };

  return (
    <>
      <Layout />
      <Grid container className="mb-24 mt-12 justify-center">
        <Paper className="bg-white w-3/6 justify-center p-2" >
          <Grid container spacing={2} >
            <Grid item xs={12} sm={6}>
              <FormControl className="w-full">
                <InputLabel className="w-full" id="remuneration">TIPO DE USUÁRIO</InputLabel>
                  <Select
                    name="userType"
                    labelId="select-userType"
                    label="TIPO DE USUÁRIO"
                    value={userData.tipo}
                    onChange={handleChangeUserType}
                  >
                    {USER_TYPE?.ARRAY.map((type:{id: number, name:string}) => (
                      <MenuItem
                          key={type.id}
                          value={type?.id}
                      >
                        {type.name}
                      </MenuItem>
                  ))}
                  </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4} >
                <FormControlLabel
                  control={<Switch color="primary" checked={userData.status === STATUS.ATIVO}  />}
                  label="Status"
                  labelPlacement="top"
                  name="status"
                  onChange={()=>handleInputData({target:{name:"status", value: userData.status === STATUS.INATIVO? STATUS.ATIVO: STATUS.INATIVO}})}
                />
                <Tooltip arrow title="Status da conta, se ela estiver ativa, o usuário conseguirá se conectar normalmente, caso não, ele não conseguirá conectar na conta">
                  <Chip
                    label={userData.status === STATUS.ATIVO? "Ativo" : "Inativo"}
                    variant={userData.status === STATUS.ATIVO? "filled" : "outlined"}
                  />
                </Tooltip>
              </Grid>
          </Grid>
          { ( userData.tipo === USER_TYPE.ALUNO ) &&
            <Grid container spacing={1} >
              <Grid item xs={12} md={6} className="mt-2" >
                <TextField
                  variant="outlined"
                  value={userData.nome}
                  onChange={handleInputData}
                  name="nome"
                  label="Nome"
                  fullWidth
                />
              </Grid>
              <Grid item className="mt-2" xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack >
                        <DesktopDatePicker
                            label="Data de Nascimento"
                            value={dataNascimento}
                            views={["year", "month", "day"]}
                            onChange={handleDateOfBirth}
                            format="DD/MM/YYYY"
                            renderInput={(params: any) => <TextField {...params} />}
                        />
                    </Stack>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={6} className="mt-2" >
                <TextField
                  variant="outlined"
                  value={userData.cpf}
                  onChange={handleInputData}
                  name="cpf"
                  label="CPF"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6} className="mt-2" >
                <TextField
                  variant="outlined"
                  value={userData.rm}
                  onChange={handleInputData}
                  name="rm"
                  label="RM Escolar"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6} className="mt-2" >
                <TextField
                  variant="outlined"
                  value={userData.email}
                  onChange={handleInputData}
                  name="email"
                  label="E-MAIL"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6} className="mt-2" >
                <TextField
                  variant="outlined"
                  value={emailConfirmation}
                  onChange={handleSetEmailValidation}                  
                  name="emailConfirmation"
                  label="Confirmação de E-MAIL"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6} className="mt-2" >
                <TextField
                  variant="outlined"
                  value={userData.senha}
                  type={passwordHidden? "password" : "text"}
                  onChange={handleInputData}
                  name="senha"
                  label="Senha"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={()=>handleClickShowPassword()}>
                          <Tooltip title="Habilita/Desabilita a visualização de senha.">
                          {passwordHidden? <EyeClosed/> : <Eye/>}
                          </Tooltip>
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} className="mt-2" >
                <TextField
                  variant="outlined"
                  value={passwordConfirmation}
                  type={passwordHidden? "password" : "text"}
                  onChange={handleSetPasswordValidation}
                  name="passwordConfirmation"
                  label="Confirmação de Senha"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={()=>handleClickShowPassword()}>
                          <Tooltip title="Habilita/Desabilita a visualização de senha.">
                            {passwordHidden? <EyeClosed/> : <Eye/>}
                          </Tooltip>
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} className="mt-2" >
                <TextField
                  variant="outlined"
                  value={userData.telefone}
                  onChange={handleInputData}
                  name="telefone"
                  label="Telefone"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6} className="mt-2" >
                <TextField
                  variant="outlined"
                  value={userData.celular}
                  onChange={handleInputData}
                  name="celular"
                  label="Celular"
                  fullWidth
                />
              </Grid>
              <Grid container spacing={2} className="p-2 mt-2">
                <Grid item className="justify-center-center" xs={12} sm={6}>
                    <Button 
                        className="bg-green-600 w-full hover:bg-green-500 text-base text-white"
                        onClick={()=>console.log(userData)}
                    > 
                            ADICIONAR USUÁRIO
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} >
                    <Button 
                        className="bg-red-600 w-full hover:bg-red-800 text-base text-white"
                        onClick={handleResetData}
                    > 
                        CANCELAR
                    </Button>
                </Grid>
              </Grid>
            </Grid>  
          }
            { (userData.tipo === USER_TYPE.EMPRESA) &&
              <Grid item xs={12}>
                <Grid container spacing={1} >
                  <Grid item xs={12} md={6} className="mt-2" >
                    <TextField
                      variant="outlined"
                      value={userData.nome_fantasia}
                      onChange={handleInputData}
                      name="nome_fantasia"
                      label="Nome Fantasia"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6} className="mt-2" >
                    <TextField
                      variant="outlined"
                      value={userData.cnpj}
                      onChange={handleInputData}
                      name="cnpj"
                      label="CNPJ"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6} className="mt-2" >
                    <TextField
                      variant="outlined"
                      value={userData.email}
                      onChange={handleInputData}
                      name="email"
                      label="E-MAIL"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6} className="mt-2" >
                    <TextField
                      variant="outlined"
                      value={emailConfirmation}
                      onChange={handleSetEmailValidation}                  
                      name="emailConfirmation"
                      label="Confirmação de E-MAIL"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6} className="mt-2" >
                    <TextField
                      variant="outlined"
                      value={userData.senha}
                      type={passwordHidden? "password" : "text"}
                      onChange={handleInputData}
                      name="senha"
                      label="Senha"
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={()=>handleClickShowPassword()}>
                              <Tooltip title="Habilita/Desabilita a visualização de senha.">
                              {passwordHidden? <EyeClosed/> : <Eye/>}
                              </Tooltip>
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} className="mt-2" >
                    <TextField
                      variant="outlined"
                      value={passwordConfirmation}
                      type={passwordHidden? "password" : "text"}
                      onChange={handleSetPasswordValidation}
                      name="passwordConfirmation"
                      label="Confirmação de Senha"
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={()=>handleClickShowPassword()}>
                              <Tooltip title="Habilita/Desabilita a visualização de senha.">
                                {passwordHidden? <EyeClosed/> : <Eye/>}
                              </Tooltip>
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} className="mt-2" >
                    <TextField
                      variant="outlined"
                      value={userData.telefone}
                      onChange={handleInputData}
                      name="telefone"
                      label="Telefone"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6} className="mt-2" >
                    <TextField
                      variant="outlined"
                      value={userData.celular}
                      onChange={handleInputData}
                      name="celular"
                      label="Celular"
                      fullWidth
                    />
                  </Grid>
                  <Grid container spacing={2} className="p-2 mt-2">
                    <Grid item className="justify-center-center" xs={12} sm={6}>
                        <Button 
                            className="bg-green-600 w-full hover:bg-green-500 text-base text-white"
                            onClick={()=>console.log(userData)}
                        > 
                                ADICIONAR USUÁRIO
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} >
                        <Button 
                            className="bg-red-600 w-full hover:bg-red-800 text-base text-white"
                            onClick={handleResetData}
                        > 
                            CANCELAR
                        </Button>
                    </Grid>
                  </Grid>
                </Grid>  
              </Grid>}
            { (userData.tipo === USER_TYPE.FUNCIONARIO) &&
              <Grid item xs={12}>
              <Grid container spacing={1} >
                <Grid item xs={12} md={6} className="mt-2" >
                  <TextField
                    variant="outlined"
                    value={userData.nome}
                    onChange={handleInputData}
                    name="nome"
                    label="Nome"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} className="mt-2" >
                  <TextField
                    variant="outlined"
                    value={userData.cpf}
                    onChange={handleInputData}
                    name="cpf"
                    label="CPF"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} className="mt-2" >
                  <TextField
                    variant="outlined"
                    value={userData.email}
                    onChange={handleInputData}
                    name="email"
                    label="E-MAIL"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} className="mt-2" >
                  <TextField
                    variant="outlined"
                    value={emailConfirmation}
                    onChange={handleSetEmailValidation}                  
                    name="emailConfirmation"
                    label="Confirmação de E-MAIL"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} className="mt-2" >
                  <TextField
                    variant="outlined"
                    value={userData.senha}
                    type={passwordHidden? "password" : "text"}
                    onChange={handleInputData}
                    name="senha"
                    label="Senha"
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={()=>handleClickShowPassword()}>
                            <Tooltip title="Habilita/Desabilita a visualização de senha.">
                            {passwordHidden? <EyeClosed/> : <Eye/>}
                            </Tooltip>
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6} className="mt-2" >
                  <TextField
                    variant="outlined"
                    value={passwordConfirmation}
                    type={passwordHidden? "password" : "text"}
                    onChange={handleSetPasswordValidation}
                    name="passwordConfirmation"
                    label="Confirmação de Senha"
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={()=>handleClickShowPassword()}>
                            <Tooltip title="Habilita/Desabilita a visualização de senha.">
                              {passwordHidden? <EyeClosed/> : <Eye/>}
                            </Tooltip>
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6} className="mt-2" >
                  <TextField
                    variant="outlined"
                    value={userData.telefone}
                    onChange={handleInputData}
                    name="telefone"
                    label="Telefone"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} className="mt-2" >
                  <TextField
                    variant="outlined"
                    value={userData.celular}
                    onChange={handleInputData}
                    name="celular"
                    label="Celular"
                    fullWidth
                  />
                </Grid>
                <Grid container spacing={2} className="p-2 mt-2">
                  <Grid item className="justify-center-center" xs={12} sm={6}>
                      <Button 
                          className="bg-green-600 w-full hover:bg-green-500 text-base text-white"
                          onClick={()=>console.log(userData)}
                      > 
                              ADICIONAR USUÁRIO
                      </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} >
                      <Button 
                          className="bg-red-600 w-full hover:bg-red-800 text-base text-white"
                          onClick={handleResetData}
                      > 
                          CANCELAR
                      </Button>
                  </Grid>
                </Grid>
              </Grid>  
            </Grid>}
        </Paper>
      </Grid>
      <LayoutBottom />
    </>
  );
}