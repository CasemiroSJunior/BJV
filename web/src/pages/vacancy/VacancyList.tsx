interface HomeProps{
    data: {
        id: number;
        titulo: string;
        descricao: string;
        salario: number;
        status: number;
        data_inicio: Date;
        data_termino: Date;
        created_At: Date;
        updated_At: Date;
    }[];
}

export default function Vacancy( props: HomeProps ) {
    fetch('http://localhost:3107/vacancy').then(response => response.json())

    return (
        <>
                {props.data.map((e, i) =>
                    <p color="white" key={i}>{e.titulo}</p>    
                )}
        </>
    )
} 

export const  getServerSideProps = async() =>{
    const response = await fetch('http://localhost:3107/vacancy')
    const data = await response.json()

    return{        
        props:{
            data: data
        }
    }
}