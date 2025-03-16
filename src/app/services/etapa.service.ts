import { httpClient } from 'app/http';
import { AxiosResponse } from 'axios';
import { Etapa } from 'app/models/etapa';

const resourceUrl: string = "/etapas";

export const useEtapaService = () => {

    // Método para listar todas as etapas
    const listarEtapas = async (): Promise<Etapa[]> => {
        const url = `${resourceUrl}/listar`;
        try {
            const response: AxiosResponse<Etapa[]> = await httpClient.get(url);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Erro ao listar etapas");
            }
            throw error;
        }
    };

    // Método para buscar uma etapa por ID
    const buscarEtapaPorId = async (id: number): Promise<Etapa> => {
        const url = `${resourceUrl}/buscar/${id}`;
        try {
            const response: AxiosResponse<Etapa> = await httpClient.get(url);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Etapa não encontrada");
            }
            throw error;
        }
    };

    // Método para cadastrar uma nova etapa
    const cadastrarEtapa = async (etapa: Etapa): Promise<string> => {
        const url = `${resourceUrl}/cadastrar`;
        try {
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.post(url, etapa);
            return response.data.mensagem; // Retorna a mensagem de sucesso
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Erro ao cadastrar etapa");
            }
            throw error;
        }
    };

    // Método para atualizar uma etapa existente
    const atualizarEtapa = async (etapa: Etapa): Promise<string> => {
        const url = `${resourceUrl}/alterar`;
        try {
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.put(url, etapa);
            return response.data.mensagem; // Retorna a mensagem de sucesso
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Erro ao atualizar etapa");
            }
            throw error;
        }
    };

    // Método para remover uma etapa por ID
    const removerEtapa = async (id: number): Promise<string> => {
        const url = `${resourceUrl}/remover/${id}`;
        try {
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.delete(url);
            return response.data.mensagem; // Retorna a mensagem de sucesso
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Erro ao remover etapa");
            }
            throw error;
        }
    };

    return {
        listarEtapas,
        buscarEtapaPorId,
        cadastrarEtapa,
        atualizarEtapa,
        removerEtapa
    };
};