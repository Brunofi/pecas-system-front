import { httpClient } from 'app/http';
import { AxiosResponse } from 'axios';
import { Usuario } from 'app/models/usuario';
import { LoginResponse } from 'app/models/login';

const resourceUrl: string = "/usuarios";

export const useUsuarioService = () => {

    // Método para listar todos os usuários
    const listarUsuarios = async (): Promise<Usuario[]> => {
        const url = `${resourceUrl}/listar`;
        try {
            const response: AxiosResponse<Usuario[]> = await httpClient.get(url);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Erro ao listar usuários");
            }
            throw error;
        }
    };

    // Método para cadastrar um novo usuário
    const cadastrarUsuario = async (usuario: Usuario): Promise<string> => {
        const url = `${resourceUrl}/cadastrar`;
        try {
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.post(url, usuario);
            return response.data.mensagem; // Retorna a mensagem de sucesso
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Erro ao cadastrar usuário");
            }
            throw error;
        }
    };

    // Método para atualizar um usuário existente
    const atualizarUsuario = async (usuario: Usuario): Promise<string> => {
        const url = `${resourceUrl}/alterar`;
        try {
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.put(url, usuario);
            return response.data.mensagem; // Retorna a mensagem de sucesso
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Erro ao atualizar usuário");
            }
            throw error;
        }
    };

    // Método para remover um usuário por ID
    const removerUsuario = async (id: number): Promise<string> => {
        const url = `${resourceUrl}/remover/${id}`;
        try {
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.delete(url);
            return response.data.mensagem; // Retorna a mensagem de sucesso
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Erro ao remover usuário");
            }
            throw error;
        }
    };

    // Método para autenticar um usuário
    const autenticarUsuario = async (email: string, senha: string): Promise<LoginResponse> => {
        const url = `${resourceUrl}/login`;
        try {
            const response: AxiosResponse<LoginResponse> = await httpClient.post(url, { email, senha });
            return response.data; // Retorna token e perfil
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Erro ao autenticar usuário");
            }
            throw error;
        }
    };

    return {
        listarUsuarios,
        cadastrarUsuario,
        atualizarUsuario,
        removerUsuario,
        autenticarUsuario
    };
};