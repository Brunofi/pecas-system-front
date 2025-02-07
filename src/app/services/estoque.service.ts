import { httpClient } from 'app/http';
import { AxiosResponse } from 'axios';
import { Estoque } from 'app/models/estoque';

const resourceUrl: string = "/estoques";

export const useEstoqueService = () => {

    const cadastrarComIds = async (idPeca: number, idLocacao: number): Promise<string> => {
        const url = `${resourceUrl}/cadastrar-com-ids`;
        try {
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.post(url, null, {
                params: {
                    idPeca,
                    idLocacao
                }
            });
            
            return response.data.mensagem; // Retorna a mensagem de sucesso
        } catch (error: any) {
            if (error.response) {
                // Captura a mensagem de erro enviada pelo back-end
                throw new Error(error.response.data.mensagem);
            }
            throw error;
        }
    };

    const buscarEstoquesPorPartNumber = async (partNumber: string): Promise<Estoque[]> => {
        const url = `${resourceUrl}/partnumber/${encodeURIComponent(partNumber)}`;
        try {
            const response: AxiosResponse<Estoque[]> = await httpClient.get<Estoque[]>(url);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                // Lança a mensagem de erro do back-end
                throw new Error(error.response.data.mensagem || "Erro ao buscar estoques");
            }
            throw error;
        }
    };

    const buscarEstoquesPorNome = async (nome: string): Promise<Estoque[]> => {
        const url = `${resourceUrl}/nome/${encodeURIComponent(nome)}`;
        try {
            const response: AxiosResponse<Estoque[]> = await httpClient.get<Estoque[]>(url);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                // Lança a mensagem de erro do back-end
                throw new Error(error.response.data.mensagem || "Erro ao buscar estoques");
            }
            throw error;
        }
    };

    const buscarEstoquePorId = async (id: number): Promise<Estoque> => {
        const url = `${resourceUrl}/${id}`;
        try {
            const response: AxiosResponse<Estoque> = await httpClient.get<Estoque>(url);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                // Lança mensagem caso o estoque não seja encontrado
                throw new Error(error.response.data?.mensagem || "Estoque não encontrado");
            }
            throw error;
        }
    };

    
     const alterarQuantidade = async (id: number, quantidade: number): Promise<string> => {
        const url = `${resourceUrl}/alterar-quantidade/${id}`;
        try {
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.put(url, null, {
                params: {
                    quantidade
                }
            });
            
            return response.data.mensagem; // Retorna a mensagem de sucesso
        } catch (error: any) {
            if (error.response) {
                // Captura a mensagem de erro enviada pelo back-end
                throw new Error(error.response.data.mensagem);
            }
            throw error;
        }
    };
    
    


    return {
        cadastrarComIds,
        buscarEstoquesPorPartNumber,
        buscarEstoquePorId,
        alterarQuantidade,
        buscarEstoquesPorNome
    };


};