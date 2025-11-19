"use client";
import React, { useEffect, useState } from "react";
import 'bulma/css/bulma.css';
import { Orcamento } from "app/models/orcamento";
import { useOrcamentoService } from "app/services";

type TabelaLancarPecasEntreguesProps = {
    filtros: {
        chassis: string;
        etapa: string;
    };
    onOrcamentoSelecionado?: (orcamento: Orcamento | null) => void;
};

export const TabelaLancarPecasEntregues: React.FC<TabelaLancarPecasEntreguesProps> = ({ 
    filtros, 
    onOrcamentoSelecionado
}) => {
    const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
    const [loading, setLoading] = useState(false);
    const [dadosCarregados, setDadosCarregados] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState<'is-success' | 'is-danger' | ''>('');
    const [orcamentoSelecionado, setOrcamentoSelecionado] = useState<Orcamento | null>(null);

    const orcamentoService = useOrcamentoService();

    const mostrarMensagem = (mensagem: string, tipo: 'is-success' | 'is-danger') => {
        setMensagem(mensagem);
        setTipoMensagem(tipo);
        setTimeout(() => {
            setMensagem('');
            setTipoMensagem('');
        }, 5000);
    };

    // Função para carregar os orçamentos
    const carregarOrcamentos = async () => {
        // Validar que ambos os filtros estão preenchidos
        if (!filtros.chassis || !filtros.etapa) {
            setOrcamentos([]);
            setDadosCarregados(false);
            return;
        }

        try {
            setLoading(true);
            setDadosCarregados(false);

            // Buscar orçamentos com os filtros
            const dados = await orcamentoService.listarPorFiltros({
                chassis: filtros.chassis,
                etapa: filtros.etapa,
                sessao: undefined,
                motivo: undefined
            });

            // Filtrar apenas peças com status "ENTREGUE"
            const dadosFiltrados = dados.filter(orc => orc.statusPeca === 'ENTREGUE');

            setOrcamentos(dadosFiltrados);
            setDadosCarregados(true);

            if (dadosFiltrados.length === 0) {
                mostrarMensagem("Nenhuma peça com status ENTREGUE encontrada com os filtros selecionados.", 'is-danger');
            }

        } catch (error: any) {
            console.error("Erro ao carregar orçamentos:", error);
            
            // Tratar erro específico de validação do backend
            if (error.message && error.message.includes("obrigatórios")) {
                // Se o erro for sobre campos obrigatórios, tratar como "sem resultados"
                setOrcamentos([]);
                setDadosCarregados(true);
                mostrarMensagem("Nenhuma peça com status ENTREGUE encontrada com os filtros selecionados.", 'is-danger');
            } else {
                // Outros erros são mostrados normalmente
                mostrarMensagem("Erro ao carregar orçamentos: " + error.message, 'is-danger');
                setOrcamentos([]);
                setDadosCarregados(false);
            }
        } finally {
            setLoading(false);
        }
    };

    // Carregar quando filtros mudam (a key do componente pai força recarregamento)
    useEffect(() => {
        // Só carrega se AMBOS os filtros estiverem preenchidos
        if (filtros.chassis && filtros.etapa) {
            carregarOrcamentos();
        } else {
            setOrcamentos([]);
            setDadosCarregados(false);
        }
    }, [filtros.chassis, filtros.etapa]);

    // Função para lidar com clique na linha
    const handleRowClick = (orcamento: Orcamento) => {
        setOrcamentoSelecionado(orcamento);
        if (onOrcamentoSelecionado) {
            onOrcamentoSelecionado(orcamento);
        }
    };

    return (
        <div className="box" style={{ marginTop: "20px" }}>
            <h2 className="title is-6">Peças Entregues para Lançamento</h2>

            {/* Mensagem de feedback */}
            {mensagem && (
                <div className={`notification ${tipoMensagem}`} style={{ marginBottom: '15px' }}>
                    {mensagem}
                </div>
            )}

            {loading ? (
                <progress className="progress is-small is-primary" max="100">Carregando...</progress>
            ) : !dadosCarregados ? (
                <p className="has-text-grey">Selecione os filtros (Chassis e Etapa) para visualizar as peças entregues.</p>
            ) : orcamentos.length === 0 ? (
                <p className="has-text-grey">Nenhuma peça com status ENTREGUE encontrada com os filtros selecionados.</p>
            ) : (
                <div className="table-container">
                    <table className="table is-striped is-hoverable is-fullwidth">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Part Number</th>
                                <th>Nome Peça</th>
                                <th>Qtd Pedida</th>
                                <th>Estado Peça</th>
                                <th>Chassis</th>
                                <th>Etapa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orcamentos.map((orcamento) => (
                                <tr 
                                    key={orcamento.id}
                                    onClick={() => handleRowClick(orcamento)}
                                    style={{
                                        backgroundColor: orcamentoSelecionado?.id === orcamento.id ? '#e6f7ff' : 'inherit',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <td>{orcamento.id || '-'}</td>
                                    <td>{orcamento.partnumber || '-'}</td>
                                    <td>{orcamento.nomePeca || '-'}</td>
                                    <td>{orcamento.quantidade || '-'}</td>
                                    <td>{orcamento.estadoPeca || '-'}</td>
                                    <td>{orcamento.chassis || '-'}</td>
                                    <td>{orcamento.etapa || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};