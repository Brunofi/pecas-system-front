export interface Orcamento {
    id?: number;
    partnumber?: string;
    nomePeca?: string;
    dataPedido?: string;
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
    statusPeca?: 'PENDENTE' | 'SEPARADA' | 'ENTREGUE' | 'LANCADA' | 
                 'INDISPONIVEL' | 'CANCELADA' | 'SOLUCIONADO INTERNO' | 'VALE PECA';
}