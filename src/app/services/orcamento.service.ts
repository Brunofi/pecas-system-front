import { httpClient } from 'app/http';
import { Orcamento } from 'app/models/orcamento';
import { AxiosResponse } from 'axios';

const resourceUrl: string = "/orcamentos";

export const useOrcamentoService = () => {

    // Cadastra um novo orçamento
    const cadastrar = async (orcamento: Orcamento): Promise<string> => {
        try {
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.post(`${resourceUrl}/cadastrar`, orcamento);
            return response.data.mensagem;
        } catch (error: any) {
            if (error.response?.data?.mensagem) {
                throw new Error(error.response.data.mensagem);
            }
            throw error;
        }
    };

    // Lista todos os orçamentos
    const listar = async (): Promise<Orcamento[]> => {
        try {
            const response: AxiosResponse<Orcamento[]> = await httpClient.get(`${resourceUrl}/listar`);
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.mensagem) {
                throw new Error(error.response.data.mensagem);
            }
            throw error;
        }
    };

    // Busca orçamento por ID
    const buscarPorId = async (id: number): Promise<Orcamento> => {
        try {
            const response: AxiosResponse<Orcamento> = await httpClient.get(`${resourceUrl}/buscar/${id}`);
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.mensagem) {
                throw new Error(error.response.data.mensagem);
            }
            throw error;
        }
    };

    // Atualiza um orçamento
    const atualizar = async (orcamento: Orcamento): Promise<string> => {
        try {
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.put(`${resourceUrl}/alterar`, orcamento);
            return response.data.mensagem;
        } catch (error: any) {
            if (error.response?.data?.mensagem) {
                throw new Error(error.response.data.mensagem);
            }
            throw error;
        }
    };

    // Remove um orçamento por ID
    const remover = async (id: number): Promise<string> => {
        try {
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.delete(`${resourceUrl}/remover/${id}`);
            return response.data.mensagem;
        } catch (error: any) {
            if (error.response?.data?.mensagem) {
                throw new Error(error.response.data.mensagem);
            }
            throw error;
        }
    };


    const listarPorFiltros = async (filtros: {
        chassis: string;
        etapa: string;
        sessao?: string;
        motivo?: string;
    }): Promise<Orcamento[]> => {
        try {
            // Remove campos vazios ou undefined
            const params: any = {
                chassis: filtros.chassis,
                etapa: filtros.etapa
            };

            if (filtros.sessao) params.sessao = filtros.sessao;
            if (filtros.motivo) params.motivo = filtros.motivo;

            const response: AxiosResponse<Orcamento[]> = await httpClient.get(
                `${resourceUrl}/filtrar`,
                { params }
            );
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 204) { // NO_CONTENT
                return [];
            }
            if (error.response?.data?.mensagem) {
                throw new Error(error.response.data.mensagem);
            }
            throw error;
        }
    };

    const cancelarSolicitacao = async (id: number): Promise<string> => {
    try {
        const response: AxiosResponse<{ mensagem: string }> = await httpClient.put(
            `${resourceUrl}/cancelar/${id}`
        );
        return response.data.mensagem;
    } catch (error: any) {
        if (error.response?.data?.mensagem) {
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
        listarPorFiltros,
        cancelarSolicitacao

    };
};
