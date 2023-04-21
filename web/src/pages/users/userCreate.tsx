import { useState } from "react";
import axios from "axios";
import {
  Container,
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
} from "@mui/material"

import { useRouter } from "next/router";
import Layout from "../layout";
import LayoutBottom from "../layoutBottom";
import { STATUS, USER_TYPE } from "@/config/constants";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
    tipo: USER_TYPE.FUNCIONARIO
  };

  const NEW_USER_ALUNO = {
    ...NEW_USER,
    nome: "",
    rm: null,
    data_nascimento: "",
    cpf: "",
    telefone: "",
    tipo: USER_TYPE.ALUNO
    
  }

  const NEW_USER_EMPRESA = {
    ...NEW_USER,
    nome_fantasia: "",
    cnpj: "",
    telefone:"",
    tipo: USER_TYPE.EMPRESA
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
            <Grid item xs={12} sm={6} >
              <FormControl className="w-full">
                <InputLabel id="remuneration">TIPO DE USUÁRIO</InputLabel>
                  <Select
                    name="userType"
                    labelId="select-userType"
                    label="Tipo de Usuário"
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
          </Grid>
          <Grid container >
          { ( userData.tipo === USER_TYPE.ALUNO ) &&
              <Grid item xs={12}>
                



              </Grid>}
            { (userData.tipo === USER_TYPE.EMPRESA) &&
              <Grid item xs={12}>





              </Grid>}
            { (userData.tipo === USER_TYPE.FUNCIONARIO) &&
              <Grid item xs={12}>






              </Grid>}
          </Grid>
        </Paper>
      </Grid>
      <LayoutBottom />
    </>
  );
}