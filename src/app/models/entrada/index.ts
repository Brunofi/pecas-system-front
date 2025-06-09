export interface Entrada {
    id?: number;
    quantidadeEntrada?: number;
    motivo?: string;
    colaborador?: string;
    observacao?: string;
    peca: { id: number };
    locacao: { id: number };
    estoque?: { id: number };
}