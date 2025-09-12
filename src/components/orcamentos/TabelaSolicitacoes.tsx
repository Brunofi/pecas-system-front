"use client";
import React, { useEffect, useState } from "react";
import 'bulma/css/bulma.css';
import { Orcamento } from "app/models/orcamento";
import { useOrcamentoService } from "app/services";

type TabelaSolicitacoesProps = {
    filtros: {
        chassis: string;
        etapa: string;
        sessao: string;
        motivo: string;
        tipoComponente: "motor" | "cambio";
        componente: string;
    };
    novaSolicitacao: Orcamento | null;
};

export const TabelaSolicitacoes: React.FC<TabelaSolicitacoesProps> = ({ filtros, novaSolicitacao }) => {
    const [solicitacoes, setSolicitacoes] = useState<Orcamento[]>([]);
    const [loading, setLoading] = useState(false);
    const [filtrosProntos, setFiltrosProntos] = useState(false);
    const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState<Orcamento | null>(null);
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState<'is-success' | 'is-danger' | ''>('');

    const orcamentoService = useOrcamentoService();

    // Função para carregar as solicitações
    const carregarSolicitacoes = async () => {
        // Só busca se os filtros obrigatórios estão preenchidos
        if (!filtros.chassis || !filtros.etapa) {
            setSolicitacoes([]);
            setFiltrosProntos(false);
            return;
        }

        try {
            setLoading(true);
            const dados = await orcamentoService.listarPorFiltros({
                chassis: filtros.chassis,
                etapa: filtros.etapa,
                sessao: filtros.sessao || undefined,
                motivo: filtros.motivo || undefined
            });
            setSolicitacoes(dados);
            setFiltrosProntos(true);
        } catch (error) {
            console.error("Erro ao carregar solicitações:", error);
            setSolicitacoes([]);
        } finally {
            setLoading(false);
        }
    };

    // Função para formatar a data
    const formatarData = (dataString?: string) => {
        if (!dataString) return '-';
        
        try {
            const data = new Date(dataString);
            // Verifica se é uma data válida
            if (isNaN(data.getTime())) {
                return '-';
            }
            return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR');
        } catch {
            return '-';
        }
    };

    const mostrarMensagem = (mensagem: string, tipo: 'is-success' | 'is-danger') => {
        setMensagem(mensagem);
        setTipoMensagem(tipo);
        setTimeout(() => {
            setMensagem('');
            setTipoMensagem('');
        }, 5000);
    };

    // Função para verificar se pode cancelar
    const podeCancelar = (status?: string): boolean => {
        return status === 'PENDENTE' || status === 'SEPARADA';
    };

    // Função para cancelar solicitação
    const handleCancelar = async () => {
        if (!solicitacaoSelecionada || !solicitacaoSelecionada.id) {
            mostrarMensagem("Selecione uma solicitação para cancelar", 'is-danger');
            return;
        }

        if (!podeCancelar(solicitacaoSelecionada.statusPeca)) {
            mostrarMensagem("Esta solicitação não pode ser cancelada", 'is-danger');
            return;
        }

        try {
            const mensagemSucesso = await orcamentoService.cancelarSolicitacao(solicitacaoSelecionada.id);
            mostrarMensagem(mensagemSucesso, 'is-success');

            // Recarrega a lista
            carregarSolicitacoes();
            setSolicitacaoSelecionada(null);

        } catch (error: any) {
            mostrarMensagem(error.message || "Erro ao cancelar solicitação", 'is-danger');
        }
    };

    // Carregar quando filtros obrigatórios mudam
    useEffect(() => {
        carregarSolicitacoes();
    }, [filtros.chassis, filtros.etapa, filtros.sessao, filtros.motivo]);

    // Atualizar quando nova peça é solicitada
    useEffect(() => {
        if (novaSolicitacao) {
            carregarSolicitacoes();
        }
    }, [novaSolicitacao]);

    return (
        <div className="box" style={{ marginTop: "20px" }}>
            <h2 className="title is-6">Peças já solicitadas</h2>

            {/* Mensagem de feedback */}
            {mensagem && (
                <div className={`notification ${tipoMensagem}`} style={{ marginBottom: '15px' }}>
                    {mensagem}
                </div>
            )}

            {!filtros.chassis || !filtros.etapa ? (
                <p className="has-text-grey">Preencha chassis e etapa para visualizar as solicitações.</p>
            ) : loading ? (
                <progress className="progress is-small is-primary" max="100">Carregando...</progress>
            ) : solicitacoes.length === 0 ? (
                <p className="has-text-grey">
                    {filtrosProntos
                        ? "Nenhuma solicitação encontrada para os filtros selecionados."
                        : "Carregando solicitações..."
                    }
                </p>
            ) : (
                <>
                    <div className="table-container">
                        <table className="table is-striped is-hoverable is-fullwidth">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Part Number</th>
                                    <th>Peça</th>
                                    <th>QTD</th>
                                    <th>Data</th>
                                    <th>Solicitante</th>
                                    <th>Lado</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {solicitacoes.map((solicitacao) => (
                                    <tr
                                        key={solicitacao.id}
                                        onClick={() => setSolicitacaoSelecionada(solicitacao)}
                                        style={{
                                            backgroundColor: solicitacaoSelecionada?.id === solicitacao.id ? '#e6f7ff' : 'inherit',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <td>{solicitacao.id}</td>
                                        <td>{solicitacao.partnumber || '-'}</td>
                                        <td>{solicitacao.nomePeca || '-'}</td>
                                        <td>{solicitacao.quantidade}</td>
                                        <td>{solicitacao.dataPedido ? formatarData(solicitacao.dataPedido) : '-'}</td>
                                        <td>{solicitacao.colaboradorPedido || '-'}</td>
                                        <td>{solicitacao.eixoLado || '-'}</td>
                                        <td>
                                            <span className={`tag ${solicitacao.statusPeca === 'PENDENTE' ? 'is-warning' :
                                                solicitacao.statusPeca === 'SEPARADA' ? 'is-info' :
                                                    solicitacao.statusPeca === 'CANCELADA' ? 'is-danger' : 'is-success'}`}>
                                                {solicitacao.statusPeca || 'PENDENTE'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Botão de cancelamento */}
                    {solicitacaoSelecionada && (
                        <div className="field" style={{ marginTop: '20px' }}>
                            <div className="control">
                                <button
                                    onClick={handleCancelar}
                                    disabled={!podeCancelar(solicitacaoSelecionada.statusPeca)}
                                    className={`button is-danger ${!podeCancelar(solicitacaoSelecionada.statusPeca) ? 'is-static' : ''}`}
                                >
                                    Cancelar Solicitação
                                </button>
                                {!podeCancelar(solicitacaoSelecionada.statusPeca) && (
                                    <p className="help">Só é possível cancelar solicitações com status PENDENTE ou SEPARADA</p>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};