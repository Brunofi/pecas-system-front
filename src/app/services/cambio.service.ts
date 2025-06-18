import { httpClient } from 'app/http';
import { AxiosResponse } from 'axios';
import { Cambio } from 'app/models/cambio';

const resourceUrl: string = "/cambios";

export const useCambioService = () => {

    // Lista todos os câmbios
    const listarCambios = async (): Promise<Cambio[]> => {
        const url = `${resourceUrl}/listar`;
        try {
            const response: AxiosResponse<Cambio[]> = await httpClient.get(url);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Erro ao listar câmbios");
            }
            throw error;
        }
    };

    // Busca um câmbio por ID
    const buscarCambioPorId = async (id: number): Promise<Cambio> => {
        const url = `${resourceUrl}/buscar/${id}`;
        try {
            const response: AxiosResponse<Cambio> = await httpClient.get(url);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Câmbio não encontrado");
            }
            throw error;
        }
    };

    // Cadastra um novo câmbio
    const cadastrarCambio = async (cambio: Cambio): Promise<string> => {
        const url = `${resourceUrl}/cadastrar`;
        try {
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.post(url, cambio);
            return response.data.mensagem;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Erro ao cadastrar câmbio");
            }
            throw error;
        }
    };

    // Atualiza um câmbio existente
    const atualizarCambio = async (cambio: Cambio): Promise<string> => {
        const url = `${resourceUrl}/alterar`;
        try {
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.put(url, cambio);
            return response.data.mensagem;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Erro ao atualizar câmbio");
            }
            throw error;
        }
    };

    // Remove um câmbio por ID
    const removerCambio = async (id: number): Promise<string> => {
        const url = `${resourceUrl}/remover/${id}`;
        try {
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.delete(url);
            return response.data.mensagem;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Erro ao remover câmbio");
            }
            throw error;
        }
    };

    return {
        listarCambios,
        buscarCambioPorId,
        cadastrarCambio,
        atualizarCambio,
        removerCambio
    };
};