import { httpClient } from 'app/http';
import { Locacao } from 'app/models/locacao'; 
import { AxiosResponse } from 'axios';

const resourceUrl: string = "/locacoes";

export const useLocacaoService = () => {

    const salvar = async (locacao: Locacao): Promise<string> => {
        try {
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.post(`${resourceUrl}/cadastrar`, locacao);
            return response.data.mensagem; // Retorna a mensagem de sucesso
        } catch (error: any) {
            if (error.response) {
                // Captura a mensagem de erro enviada pelo back-end
                throw new Error(error.response.data.mensagem);
            }
            throw error;
        }
    };

    const alterar = async (locacao: Locacao): Promise<string> => {
        try {
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.put(`${resourceUrl}/alterar`, locacao);
            return response.data.mensagem; // Retorna a mensagem de sucesso
        } catch (error: any) {
            if (error.response) {
                // Captura a mensagem de erro enviada pelo back-end
                throw new Error(error.response.data.mensagem);
            }
            throw error;
        }
    };

    const buscarLocacoes = async (locacao?: string): Promise<Locacao[]> => {
        const url = `${resourceUrl}/listar?locacao=${encodeURIComponent(locacao || "")}`;
        try {
            const response: AxiosResponse<Locacao[]> = await httpClient.get<Locacao[]>(url);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                // Lança a mensagem de erro do back-end
                throw new Error(error.response.data.mensagem);
            }
            throw error;
        }
    };

    const buscarLocacaoPorId = async (id: number): Promise<Locacao> => {
        const url = `${resourceUrl}/buscar/${id}`;
        try {
            const response: AxiosResponse<Locacao> = await httpClient.get<Locacao>(url);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                // Lança a mensagem de erro do back-end
                throw new Error(error.response.data.mensagem);
            }
            throw error;
        }
    };

    const remover = async (id: number): Promise<string> => {
        const url = `${resourceUrl}/remover/${id}`;
        try {
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.delete(url);
            return response.data.mensagem; // Retorna a mensagem de sucesso ou erro
        } catch (error: any) {
            if (error.response) {
                // Captura a mensagem de erro enviada pelo back-end
                throw new Error(error.response.data.mensagem);
            }
            throw error;
        }
    };

    return {
        salvar,
        alterar,
        buscarLocacoes,
        buscarLocacaoPorId,
        remover
    };
};
