import { httpClient } from 'app/http';
import { Saida } from 'app/models/saida';
import { AxiosResponse } from 'axios';

const resourceUrl: string = "/saidas";

export const useSaidaService = () => {

    // Cadastra uma nova saída
    const cadastrar = async (saida: Saida): Promise<string> => {
        try {
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.post(resourceUrl, saida);
            return response.data.mensagem; // Retorna a mensagem de sucesso
        } catch (error: any) {
            if (error.response) {
                // Captura a mensagem de erro enviada pelo back-end
                throw new Error(error.response.data.mensagem);
            }
            throw error;
        }
    };

    // Lista todas as saídas
    const listar = async (): Promise<Saida[]> => {
        try {
            const response: AxiosResponse<Saida[]> = await httpClient.get(resourceUrl);
            return response.data; // Retorna a lista de saídas
        } catch (error: any) {
            if (error.response) {
                // Captura a mensagem de erro enviada pelo back-end
                throw new Error(error.response.data.mensagem);
            }
            throw error;
        }
    };

    // Busca uma saída por ID
    const buscarPorId = async (id: number): Promise<Saida> => {
        const url = `${resourceUrl}/${id}`;
        try {
            const response: AxiosResponse<Saida> = await httpClient.get(url);
            return response.data; // Retorna a saída encontrada
        } catch (error: any) {
            if (error.response) {
                // Captura a mensagem de erro enviada pelo back-end
                throw new Error(error.response.data.mensagem);
            }
            throw error;
        }
    };

    // Atualiza uma saída existente
    const atualizar = async (saida: Saida): Promise<string> => {
        const url = `${resourceUrl}/${saida.id}`;
        try {
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.put(url, saida);
            return response.data.mensagem; // Retorna a mensagem de sucesso
        } catch (error: any) {
            if (error.response) {
                // Captura a mensagem de erro enviada pelo back-end
                throw new Error(error.response.data.mensagem);
            }
            throw error;
        }
    };

    // Remove uma saída por ID
    const remover = async (id: number): Promise<string> => {
        const url = `${resourceUrl}/${id}`;
        try {
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.delete(url);
            return response.data.mensagem; // Retorna a mensagem de sucesso
        } catch (error: any) {
            if (error.response) {
                // Captura a mensagem de erro enviada pelo back-end
                throw new Error(error.response.data.mensagem);
            }
            throw error;
        }
    };

    // Busca lançamentos por Chassis e Etapa
    const buscarLancamentos = async (chassis: string, etapa: string): Promise<Saida[]> => {
        const url = `${resourceUrl}/buscar-lancamentos?chassis=${chassis}&etapa=${etapa}`;
        try {
            const response: AxiosResponse<{ data: Saida[] }> = await httpClient.get(url);
            return response.data.data; // Retorna a lista de saídas
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem);
            }
            throw error;
        }
    };

    // Desfaz um lançamento de saída
    const desfazerLancamento = async (id: number): Promise<string> => {
        const url = `${resourceUrl}/desfazer/${id}`;
        try {
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.delete(url);
            return response.data.mensagem; // Retorna a mensagem de sucesso
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
        remover,
        buscarLancamentos,
        desfazerLancamento
    };
};