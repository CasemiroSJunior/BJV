const  USERTYPE = {
    FUNCIONARIO: 0,
    FUNCIONARIO_NAME: 'FUNCIONÁRIO',
    ALUNO: 1,
    ALUNO_NAME: 'ALUNO',
    EMPRESA: 2,
    EMPRESA_NAME: 'EMPRESA',
    ARRAY: []
};

USERTYPE.ARRAY.push({id:USERTYPE.FUNCIONARIO , name:USERTYPE.FUNCIONARIO_NAME });
USERTYPE.ARRAY.push({id:USERTYPE.ALUNO , name:USERTYPE.ALUNO_NAME });
USERTYPE.ARRAY.push({id:USERTYPE.EMPRESA , name:USERTYPE.EMPRESA_NAME });
export { USERTYPE }