import { ChangeEvent, useEffect, useState } from "react";
import dayjs, { Dayjs } from 'dayjs';
import {
  TextField, Button, Grid, Paper, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch, Chip, Tooltip, Stack, 
  InputAdornment, IconButton,Checkbox,
} from "@mui/material"

import * as helper from "../../utils/Helper"

import Layout from "../layout";
import LayoutBottom from "../layoutBottom";
import { STATUS, USER_TYPE } from "@/config/constants";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Eye, EyeClosed } from "phosphor-react";
import { api } from "@/lib/axios";

interface Users {
  nome?: string,
  tipo: number,
  cpf?: string,
  email?: string, 
  celular?: string,
  telefone?: string,
  status: number,
  rm?: number | null,
  cnpj?: string,
  senha: string | null,
  ensinoMedio?: number | string,
  cursoTecnico?: number | string
}

interface cursoTecnico {
  curso: Array<{
    id: number,
    nome: string,
    status: number,
    duracao?: number | undefined,
    periodo?: string | undefined,
  }>
};

interface ensinoMedio {
  curso: Array<{
    id: number,
    nome: string,
    status: number,
    duracao?: number | undefined,
    periodo?: string | undefined,
  }>
};

export default function Register() {
  const [emailConfirmation, setEmailConfirmation] = useState<string >("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string >("");
  const [dataNascimento, setDataNascimento] = useState<Dayjs | null>(dayjs().subtract(10,'year'));
  const [passwordHidden, setPasswordHidden] = useState<boolean>(true)
  const [ensinoMedioList, setEnsinoMedioList] = useState<ensinoMedio>()
  const [ensinoTecnicoList, setEnsinoTecnicoList] = useState<cursoTecnico>()
  const [checkedEm, setCheckedEm] = useState<boolean>(false);
  const [checkedEt, setCheckedEt] = useState<boolean>(false);
  
  const NEW_USER = {
    senha: "",
    tipo: 99,
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
    ensinoMedio: "",
    cursoTecnico: "",
  }

  const NEW_USER_EMPRESA = {
    ...NEW_USER,
    nome: "",
    cnpj: "",
    telefone:"",
    tipo: USER_TYPE.EMPRESA,
  }

  const handleGetData = async()=>{
    await api.get('/cursos/tecnico').then((response)=> {setEnsinoTecnicoList(response.data)})
    await api.get('/cursos/medio').then((response)=> {setEnsinoMedioList(response.data)})
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
    setDataNascimento(dayjs().subtract(10,'year'))
    setPasswordHidden(true)
  }

  const handleClickShowPassword = () => {
    setPasswordHidden(!passwordHidden);
  };

  const handleResetData = ()=>{
    setUserData(NEW_USER)
    setEmailConfirmation("")
    setPasswordConfirmation("")
    setDataNascimento(dayjs().subtract(10,'year'))
    
  }

  const handleInputData = (data: {target :{ name:string; value: number | string | null | undefined;}; })=>{
    let {name, value } = data.target
    if (name === "cpf") (String(data.target.value).length) < 15? value = helper.cpf(data.target.value) : value = userData.cpf
    if (name === "cnpj") (String(data.target.value).length) < 19? value = helper.cnpj(data.target.value) : value = userData.cnpj
    if (name === "celular") value = helper.cell(data.target.value)
    if (name === "telefone") value = helper.tell(data.target.value)
    if (name === "rm") (String(data.target.value).length) < 7?   data.target.value != 0? value = Number(helper.numbersOnlyFilter(data.target.value)) : value = null : value = userData.rm
    if (name === "tipo") value = Number(data.target.value)
    if (name === "status") value = Number(data.target.value)
    if (name === 'nome') value = helper.wordOnlyFilter(data.target.value)
    
    let dataTemp = {...userData, [name]: value}
    setUserData(dataTemp)

  }

  useEffect(()=>{
    handleGetData()
  },[])


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

  const handleResetCheck = (data: any)=>{
    let {checked, name} = data.target

    if (name === "checkEm" && checked !== true){
      setCheckedEm(false)
      userData.ensinoMedio = ""
    }
    if (name === "checkEt" && checked !== true){
      setCheckedEt(false)
      userData.cursoTecnico = ""
    }
    if (name === "checkEm" && checked !== false){
      setCheckedEm(true)
    }
    if (name === "checkEt" && checked !== false){
      setCheckedEt(true)
    }
  }

  const handleDateOfBirth = (date:Dayjs | null)=>{
    setDataNascimento(date)
  }

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    
    let res
    if (userData.senha === passwordConfirmation && userData.email === emailConfirmation){
      try {
        if (userData.tipo === USER_TYPE.EMPRESA){
          res = await api.post('new/user/company',userData)
        }
        if (userData.tipo === USER_TYPE.ALUNO){
          let dataTemp = {...userData, data_nascimento: dataNascimento}
          res = await api.post('new/user/student',dataTemp)
        }
        if (userData.tipo === USER_TYPE.FUNCIONARIO){
          res = await api.post('new/user/employee',userData)
        }
        alert("Usuário criado com sucesso")
      } catch (err:any) {
        alert("Erro ao criar usuário")
      }
    }
  };

  return (
    <>
      <Layout />
      <Grid container className="mb-24 mt-12 justify-center">
        <Paper className="bg-white w-3/6 justify-center p-2" >
          <Grid container spacing={2} >
            <Grid item xs={12} sm={5}>
              <FormControl className="w-full">
                <InputLabel className="w-full" id="userType">TIPO DE USUÁRIO</InputLabel>
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
            <Grid item xs={12} md={7} >
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
              { (userData.tipo === USER_TYPE.ALUNO ) &&
                <>
                  <FormControlLabel 
                    required={(userData.ensinoMedio == "" && userData.cursoTecnico == "")} 
                    labelPlacement="bottom"
                    name="checkEm"
                    control={
                      <Checkbox 
                        checked={checkedEm}
                        onChange={handleResetCheck}
                      />
                    }
                    label="Ensino Médio" 
                  />
                  <FormControlLabel 
                    required={(userData.ensinoMedio == "" && userData.cursoTecnico == "")} 
                    labelPlacement="bottom"
                    name="checkEt"
                    control={
                      <Checkbox 
                        checked={checkedEt}
                        onChange={handleResetCheck}
                      />
                    } 
                    label="Curso Técnico" 
                  />
                </>
              }  
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
                            minDate={dayjs('1900-01-01')}
                            maxDate={dayjs().subtract(10,'year')}
                            format="DD/MM/YYYY"
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
              {checkedEm &&
              <Grid item xs={12} sm={(checkedEt && checkedEm)? 6 : 12 }>
                <FormControl className="w-full">
                  <InputLabel className="w-full" id="ensinoMedio">Ensino Médio</InputLabel>
                    <Select
                      name="ensinoMedio"
                      labelId="select-ensinoMedio"
                      label="Ensino Médio"
                      value={userData.ensinoMedio}
                      onChange={handleInputData}
                    >
                      {ensinoMedioList?.curso?.map((curso:ensinoMedio['curso'][0]) => (
                        <MenuItem
                            key={curso.id}
                            value={String(curso?.id)}
                        >
                          {curso.nome}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
              </Grid>
              }
              {checkedEt &&
              <Grid item xs={12} sm={(checkedEt && checkedEm)? 6 : 12 }>
                <FormControl className="w-full">
                  <InputLabel className="w-full" id="ensinoTecnico">Curso Técnico</InputLabel>
                    <Select
                      name="cursoTecnico"
                      labelId="select-cursoTecnico"
                      label="Curso Técnico"
                      value={userData.cursoTecnico}
                      onChange={handleInputData}
                    >
                      {ensinoTecnicoList?.curso?.map((curso:cursoTecnico['curso'][0]) => (
                        <MenuItem
                            key={curso.id}
                            value={String(curso?.id)}
                        >
                          {curso.nome}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
              </Grid>
              }
              <Grid item xs={12} md={6} className="mt-2" >
                <TextField
                  variant="outlined"
                  value={userData.email}
                  onChange={handleInputData}
                  name="email"
                  label="E-Mail"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6} className="mt-2" >
                <TextField
                  variant="outlined"
                  value={emailConfirmation}
                  onChange={handleSetEmailValidation}
                  error={userData.email !== emailConfirmation? true : false}
                  helperText={userData.email !== emailConfirmation? "E-Mail divergentes" : ""}                  
                  name="emailConfirmation"
                  label="Confirmação de E-Mail"
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
                  error={userData.senha !== passwordConfirmation? true : false}
                  helperText={userData.senha !== passwordConfirmation? "Senhas divergentes" : ""}
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
                        onClick={handleSubmit}
                        disabled={(
                          passwordConfirmation !== userData.senha ||
                           emailConfirmation !== userData.email || 
                           (userData.celular == "" && userData.telefone == "")
                           || userData.senha == "" || 
                           userData.email == ""
                        )}
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
                      value={userData.nome}
                      onChange={handleInputData}
                      name="nome"
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
                      label="E-Mail"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6} className="mt-2" >
                    <TextField
                      variant="outlined"
                      value={emailConfirmation}
                      onChange={handleSetEmailValidation}        
                      error={userData.email !== emailConfirmation? true : false}
                      helperText={userData.email !== emailConfirmation? "E-Mail divergentes" : ""}          
                      name="emailConfirmation"
                      label="Confirmação de E-Mail"
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
                      error={userData.senha !== passwordConfirmation? true : false}
                      helperText={userData.senha !== passwordConfirmation? "Senhas divergentes" : ""}
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
                            onClick={handleSubmit}
                            disabled={(passwordConfirmation !== userData.senha || emailConfirmation !== userData.email || (userData.celular == "" && userData.telefone == ""))}
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
                    label="E-Mail"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6} className="mt-2" >
                  <TextField
                    variant="outlined"
                    value={emailConfirmation}
                    error={userData.email !== emailConfirmation? true : false}
                    helperText={userData.email !== emailConfirmation? "E-Mail divergentes" : ""}
                    onChange={handleSetEmailValidation}                  
                    name="emailConfirmation"
                    label="Confirmação de E-Mail"
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
                    error={userData.senha !== passwordConfirmation? true : false}
                    helperText={userData.senha !== passwordConfirmation? "Senhas divergentes" : ""}
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
                          onClick={handleSubmit}
                          disabled={(passwordConfirmation !== userData.senha || emailConfirmation !== userData.email || (userData.celular == "" && userData.telefone == ""))}
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