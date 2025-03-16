import { httpClient } from 'app/http';
import { AxiosResponse } from 'axios';
import { Sessao } from 'app/models/sessao';

const resourceUrl: string = "/sessoes";

export const useSessaoService = () => {

    // Método para listar todas as sessões
    const listarSessoes = async (): Promise<Sessao[]> => {
        const url = `${resourceUrl}/listar`;
        try {
            const response: AxiosResponse<Sessao[]> = await httpClient.get(url);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Erro ao listar sessões");
            }
            throw error;
        }
    };

    // Método para buscar uma sessão por ID
    const buscarSessaoPorId = async (id: number): Promise<Sessao> => {
        const url = `${resourceUrl}/buscar/${id}`;
        try {
            const response: AxiosResponse<Sessao> = await httpClient.get(url);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Sessão não encontrada");
            }
            throw error;
        }
    };

    // Método para cadastrar uma nova sessão
    const cadastrarSessao = async (sessao: Sessao): Promise<string> => {
        const url = `${resourceUrl}/cadastrar`;
        try {
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.post(url, sessao);
            return response.data.mensagem; // Retorna a mensagem de sucesso
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Erro ao cadastrar sessão");
            }
            throw error;
        }
    };

    // Método para atualizar uma sessão existente
    const atualizarSessao = async (sessao: Sessao): Promise<string> => {
        const url = `${resourceUrl}/alterar`;
        try {
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.put(url, sessao);
            return response.data.mensagem; // Retorna a mensagem de sucesso
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Erro ao atualizar sessão");
            }
            throw error;
        }
    };

    // Método para remover uma sessão por ID
    const removerSessao = async (id: number): Promise<string> => {
        const url = `${resourceUrl}/remover/${id}`;
        try {
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.delete(url);
            return response.data.mensagem; // Retorna a mensagem de sucesso
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Erro ao remover sessão");
            }
            throw error;
        }
    };

    return {
        listarSessoes,
        buscarSessaoPorId,
        cadastrarSessao,
        atualizarSessao,
        removerSessao
    };
};