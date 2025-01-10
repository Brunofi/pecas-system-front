import { httpClient } from 'app/http';
import { Peca } from 'app/models/pecas';
import { AxiosResponse } from 'axios';

const resourceUrl: string = "/pecas";

export const usePecaService = () => {
    const salvar = async (peca: Peca): Promise<string> => {
        try {
            const response: AxiosResponse<{ mensagen: string }> = await httpClient.post(`${resourceUrl}/cadastrar`, peca);
            return response.data.mensagen; // Retorna a mensagem de sucesso
        } catch (error: any) {
            if (error.response) {
                // Captura a mensagem de erro enviada pelo back-end
                throw new Error(error.response.data.mensagen);
            }
            throw error;
        }
    };
    

    const alterar = async (peca: Peca): Promise<string> => {
        try {
            const response: AxiosResponse<{ mensagen: string }> = await httpClient.put(`${resourceUrl}/alterar`, peca);
            return response.data.mensagen; // Retorna a mensagem de sucesso
        } catch (error: any) {
            if (error.response) {
                // Captura a mensagem de erro enviada pelo back-end
                throw new Error(error.response.data.mensagen);
            }
            throw error;
        }
    };
    

    const buscarPecasPorPartNumber = async (partnumber?: string): Promise<Peca[]> => {
        const url = `${resourceUrl}/listar?partnumber=${encodeURIComponent(partnumber || "")}`;
        const response: AxiosResponse<Peca[]> = await httpClient.get<Peca[]>(url);
        return response.data;
      };
      
      const buscarPecasPorNome = async (nome?: string): Promise<Peca[]> => {
        const url = `${resourceUrl}/listar?nome=${encodeURIComponent(nome || "")}`;
        const response: AxiosResponse<Peca[]> = await httpClient.get<Peca[]>(url);
        return response.data;
      };
      

      const buscarPecaPorId = async (id: number): Promise<Peca> => {
        const url = `${resourceUrl}/buscar/${id}`;
        try {
            const response: AxiosResponse<Peca> = await httpClient.get<Peca>(url);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                // Lança a mensagem de erro do back-end
                throw new Error(error.response.data.mensagen);
            }
            throw error;
        }
    };
    

      const remover = async (id: number): Promise<string> => {
        const url = `${resourceUrl}/remover/${id}`;
        try {
            const response: AxiosResponse<{ mensagen: string }> = await httpClient.delete(url);
            return response.data.mensagen; // Retorna a mensagem de sucesso ou erro
        } catch (error: any) {
            if (error.response) {
                // Captura a mensagem de erro enviada pelo back-end
                throw new Error(error.response.data.mensagen);
            }
            throw error;
        }
    };

    return {
        salvar,
        buscarPecasPorPartNumber,
        buscarPecasPorNome,
        buscarPecaPorId,
        alterar,
        remover
    };
};
