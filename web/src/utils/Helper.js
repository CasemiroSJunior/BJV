/* 

    O código foi feito pelo usuário fernandovaller no GitHub, segue o link para o repositório:
        https://gist.github.com/fernandovaller/b10a3be0e7b3b46e5895b0f0e75aada5
 

*/
export const cnpj = (v) =>{
    v=v.replace(/\D/g,"")                           //Remove tudo o que não é dígito
    v=v.replace(/^(\d{2})(\d)/,"$1.$2")             //Coloca ponto entre o segundo e o terceiro dígitos
    v=v.replace(/^(\d{2})\.(\d{3})(\d)/,"$1.$2.$3") //Coloca ponto entre o quinto e o sexto dígitos
    v=v.replace(/\.(\d{3})(\d)/,".$1/$2")           //Coloca uma barra entre o oitavo e o nono dígitos
    v=v.replace(/(\d{4})(\d)/,"$1-$2")              //Coloca um hífen depois do bloco de quatro dígitos
    return v
}

export const cpf = (v) => {
    v=v.replace(/\D/g,"")                    //Remove tudo o que não é dígito
    v=v.replace(/(\d{3})(\d)/,"$1.$2")       //Coloca um ponto entre o terceiro e o quarto dígitos
    v=v.replace(/(\d{3})(\d)/,"$1.$2")       //Coloca um ponto entre o terceiro e o quarto dígitos
                                             //de novo (para o segundo bloco de números)
    v=v.replace(/(\d{3})(\d{1,2})$/,"$1-$2") //Coloca um hífen entre o terceiro e o quarto dígitos
    return v
}

export const cell = (v) =>{
    v = v.replace(/\D/g,"")
    v = v.replace(/(\d{2})(\d)/, "($1) $2")
    v = v.replace(/(\d{5})(\d)/, "$1-$2")
    v = v.replace(/(-\d{4})\d+?$/, "$1")
    return v
}

export const tell = (v) =>{
    v = v.replace(/\D/g,"")
    v = v.replace(/(\d{2})(\d)/, "($1) $2")
    v = v.replace(/(\d{4})(\d)/, "$1-$2")
    v = v.replace(/(-\d{4})\d+?$/, "$1")
    return v
}

    //Feito por conta, função fácil, porém necessária.

export const numbersOnlyFilter = (v) =>{
    v = v.replace(/\D/g,"")

    return v
}

export const wordOnlyFilter = (v) =>{
    v = v.replace(/\d/g,"")

    return v
}