import { Locacao } from "../locacao";
import { Peca } from "../pecas";
import { Estoque } from "../estoque";

export interface Saida {
    id?: number; 
    quantidade: number; 
    dataSaida?: string; 
    tipoConsumo?: string; 
    colaboradorEntrega: string; 
    colaboradorRetirada: string; 
    colaboradorLancamento?: string; 
    motivoConsumo: 'AVARIA' | 'MANUTENCAO'; 
    etapa: string; 
    sessao: string; 
    chassis: string; 
    chassisCedente?: string; 
    eixoLado?: string; 
    peca: Peca; 
    locacao: Locacao; 
    estoque?: Estoque; 
}