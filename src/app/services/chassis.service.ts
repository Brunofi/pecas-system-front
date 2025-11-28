import { httpClient } from 'app/http';
import { AxiosResponse } from 'axios';
import { Chassis } from 'app/models/chassis';

const resourceUrl: string = "/chassis";

export const useChassisService = () => {

    // Método para listar todos os chassis
    const listarChassis = async (): Promise<Chassis[]> => {
        const url = `${resourceUrl}/listar`;
        try {
            const response: AxiosResponse<Chassis[]> = await httpClient.get(url);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Erro ao listar chassis");
            }
            throw error;
        }
    };

    // Busca um chassis por ID
    const buscarChassisPorId = async (id: number): Promise<Chassis> => {
        const url = `${resourceUrl}/buscar/${id}`;
        try {
            const response: AxiosResponse<Chassis> = await httpClient.get(url);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Chassis não encontrado");
            }
            throw error;
        }
    };

    // Cadastra um novo chassis
    const cadastrarChassis = async (chassis: Chassis): Promise<string> => {
        const url = `${resourceUrl}/cadastrar`;
        try {
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.post(url, chassis);
            return response.data.mensagem;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Erro ao cadastrar chassis");
            }
            throw error;
        }
    };

    // Atualiza um chassis existente
    const atualizarChassis = async (chassis: Chassis): Promise<string> => {
        const url = `${resourceUrl}/alterar`;
        try {
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.put(url, chassis);
            return response.data.mensagem;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Erro ao atualizar chassis");
            }
            throw error;
        }
    };

    // Remove um chassis por ID
    const removerChassis = async (id: number): Promise<string> => {
        const url = `${resourceUrl}/remover/${id}`;
        try {
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.delete(url);
            return response.data.mensagem;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Erro ao remover chassis");
            }
            throw error;
        }
    };

    return {
        listarChassis,
        buscarChassisPorId,
        cadastrarChassis,
        atualizarChassis,
        removerChassis
    };
};
