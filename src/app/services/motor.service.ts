import { httpClient } from 'app/http';
import { AxiosResponse } from 'axios';
import { Motor } from 'app/models/motor';

const resourceUrl: string = "/motores";

export const useMotorService = () => {

    // Lista todos os motores
    const listarMotores = async (): Promise<Motor[]> => {
        const url = `${resourceUrl}/listar`;
        try {
            const response: AxiosResponse<Motor[]> = await httpClient.get(url);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Erro ao listar motores");
            }
            throw error;
        }
    };

    // Busca um motor por ID
    const buscarMotorPorId = async (id: number): Promise<Motor> => {
        const url = `${resourceUrl}/buscar/${id}`;
        try {
            const response: AxiosResponse<Motor> = await httpClient.get(url);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Motor não encontrado");
            }
            throw error;
        }
    };

    // Cadastra um novo motor
    const cadastrarMotor = async (motor: Motor): Promise<string> => {
        const url = `${resourceUrl}/cadastrar`;
        try {
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.post(url, motor);
            return response.data.mensagem;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Erro ao cadastrar motor");
            }
            throw error;
        }
    };

    // Atualiza um motor existente
    const atualizarMotor = async (motor: Motor): Promise<string> => {
        const url = `${resourceUrl}/alterar`;
        try {
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.put(url, motor);
            return response.data.mensagem;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Erro ao atualizar motor");
            }
            throw error;
        }
    };

    // Remove um motor por ID
    const removerMotor = async (id: number): Promise<string> => {
        const url = `${resourceUrl}/remover/${id}`;
        try {
            const response: AxiosResponse<{ mensagem: string }> = await httpClient.delete(url);
            return response.data.mensagem;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.mensagem || "Erro ao remover motor");
            }
            throw error;
        }
    };

    return {
        listarMotores,
        buscarMotorPorId,
        cadastrarMotor,
        atualizarMotor,
        removerMotor
    };
};