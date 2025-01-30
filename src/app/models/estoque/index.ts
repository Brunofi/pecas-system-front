import { Locacao } from "../locacao";
import { Peca } from "../pecas";

export interface Estoque {
    id?: number;
    quantidade?: number;
    peca?: Peca;
    locacao?: Locacao;
}