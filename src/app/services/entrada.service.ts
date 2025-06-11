import { httpClient } from 'app/http';
import { Entrada } from 'app/models/entrada';
import { AxiosResponse } from 'axios';

const resourceUrl: string = "/entradas";

export const useEntradaService = () => {

    // Cadastra uma nova entrada
    const cadastrar = async (entrada: Entrada, idEstoque: number): Promise<string> => {
        try {
            // Envia o idEstoque como query parameter
            const params = new URLSearchParams();
            params.append('idEstoque', idEstoque.toString());
            
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.post(
                resourceUrl, 
                entrada,
                { params }
            );
            return response.data.mensagem;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem);
            }
            throw error;
        }
    };

    // Lista todas as entradas
    const listar = async (): Promise<Entrada[]> => {
        try {
            const response: AxiosResponse<Entrada[]> = await httpClient.get(resourceUrl);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem);
            }
            throw error;
        }
    };

    // Busca uma entrada por ID
    const buscarPorId = async (id: number): Promise<Entrada> => {
        const url = `${resourceUrl}/${id}`;
        try {
            const response: AxiosResponse<Entrada> = await httpClient.get(url);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem);
            }
            throw error;
        }
    };

    // Atualiza uma entrada existente
    const atualizar = async (entrada: Entrada): Promise<string> => {
        const url = `${resourceUrl}/${entrada.id}`;
        try {
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.put(url, entrada);
            return response.data.mensagem;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem);
            }
            throw error;
        }
    };

    // Remove uma entrada por ID
    const remover = async (id: number): Promise<string> => {
        const url = `${resourceUrl}/${id}`;
        try {
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.delete(url);
            return response.data.mensagem;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem);
            }
            throw error;
        }
    };

    return {
        cadastrar,
        listar,
        buscarPorId,
        atualizar,
        remover
    };
};