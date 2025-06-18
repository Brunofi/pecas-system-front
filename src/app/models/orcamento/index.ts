export interface Orcamento {
    id?: number;
    partnumber?: string;
    nomePeca?: string;
    dataPedido?: string; // timestamp no banco
    quantidade: number;
    colaboradorEntrega?: string;
    colaboradorPedido: string;
    motivoConsumo: 'AVARIA' | 'MANUTENCAO';
    etapa: string;
    sessao: string;
    chassis: string;
    eixoLado?: string;
    numeroMotorCambio?: string;
    estadoPeca?: string;
    statusPeca?: string;
}
