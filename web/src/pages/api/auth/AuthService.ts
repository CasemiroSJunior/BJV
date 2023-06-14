/* import { Api } from '../axios-config';

interface IAuth {
    accessToken: String;
}
    
const auth = async (email: string, password: string): Promise<IAuth | Error>  => {
    try {
        const { data } = await Api.get('/auth', {data: { email, password}});
    

        if(data) {
            return data;
        }

        return new Error('Erro no Login '); 
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro no Login');
    }
};
export const AuthService = {
    auth,
}    */