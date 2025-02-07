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

    return {
        listarChassis,
        buscarChassisPorId
    };
};
