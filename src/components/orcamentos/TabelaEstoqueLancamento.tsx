"use client";
import React, { useEffect, useState } from "react";
import 'bulma/css/bulma.css';
import { Estoque } from "app/models/estoque";
import { useEstoqueService } from "app/services";
import { useOrcamentoService } from "app/services";
import { Orcamento } from "app/models/orcamento";

type TabelaEstoqueLancamentoProps = {
    orcamentoSelecionado: Orcamento | null;
    onRegistroSucesso?: () => void;
};

export const TabelaEstoqueLancamento: React.FC<TabelaEstoqueLancamentoProps> = ({ 
    orcamentoSelecionado,
    onRegistroSucesso
}) => {
    const [estoques, setEstoques] = useState<Estoque[]>([]);
    const [loading, setLoading] = useState(false);
    const [estoqueSelecionado, setEstoqueSelecionado] = useState<Estoque | null>(null);
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState<'is-success' | 'is-danger' | ''>('');

    const estoqueService = useEstoqueService();
    const orcamentoService = useOrcamentoService();

    const mostrarMensagem = (mensagem: string, tipo: 'is-success' | 'is-danger') => {
        setMensagem(mensagem);
        setTipoMensagem(tipo);
        setTimeout(() => {
            setMensagem('');
            setTipoMensagem('');
        }, 5000);
    };

    // Buscar estoques quando um orçamento é selecionado
    useEffect(() => {
        const buscarEstoques = async () => {
            if (!orcamentoSelecionado || !orcamentoSelecionado.partnumber) {
                setEstoques([]);
                setEstoqueSelecionado(null);
                return;
            }

            try {
                setLoading(true);
                const dados = await estoqueService.buscarEstoquesPorPartNumber(
                    orcamentoSelecionado.partnumber
                );
                setEstoques(dados);
            } catch (error: any) {
                console.error("Erro ao buscar estoques:", error);
                mostrarMensagem("Erro ao buscar estoques: " + error.message, 'is-danger');
                setEstoques([]);
            } finally {
                setLoading(false);
            }
        };

        buscarEstoques();
    }, [orcamentoSelecionado]);

    // Função para lidar com clique na linha
    const handleRowClick = (estoque: Estoque) => {
        setEstoqueSelecionado(estoque);
    };

    // Função para registrar (dar baixa no estoque)
    const handleRegistrar = async () => {
        if (!estoqueSelecionado || !estoqueSelecionado.id) {
            mostrarMensagem("Selecione um item da tabela de estoque para registrar", 'is-danger');
            return;
        }

        if (!orcamentoSelecionado || !orcamentoSelecionado.id) {
            mostrarMensagem("Selecione um orçamento primeiro", 'is-danger');
            return;
        }

        if (!estoqueSelecionado.quantidade || estoqueSelecionado.quantidade <= 0) {
            mostrarMensagem("Quantidade em estoque inválida", 'is-danger');
            return;
        }

        // Calcular nova quantidade (subtrair a quantidade pedida)
        const quantidadeAtual = estoqueSelecionado.quantidade;
        const quantidadePedida = orcamentoSelecionado.quantidade;
        const novaQuantidade = quantidadeAtual - quantidadePedida;

        if (novaQuantidade < 0) {
            mostrarMensagem("Quantidade em estoque insuficiente", 'is-danger');
            return;
        }

        try {
            // 1. Dar baixa no estoque
            await estoqueService.alterarQuantidade(
                estoqueSelecionado.id,
                novaQuantidade
            );
            
            // 2. Atualizar status do orçamento para "LANCADA"
            const orcamentoAtualizado: Orcamento = {
                ...orcamentoSelecionado,
                statusPeca: 'LANCADA'
            };

            await orcamentoService.atualizar(orcamentoAtualizado);
            
            mostrarMensagem("Registro realizado com sucesso! Status alterado para LANCADA.", 'is-success');
            
            // 3. Atualizar a lista de estoques
            if (orcamentoSelecionado.partnumber) {
                const dados = await estoqueService.buscarEstoquesPorPartNumber(
                    orcamentoSelecionado.partnumber
                );
                setEstoques(dados);
            }
            
            // 4. Limpar seleções
            setEstoqueSelecionado(null);
            
            // 5. Notificar o componente pai para recarregar a lista de orçamentos
            if (onRegistroSucesso) {
                onRegistroSucesso();
            }
            
        } catch (error: any) {
            console.error("Erro ao registrar:", error);
            mostrarMensagem("Erro ao registrar: " + error.message, 'is-danger');
        }
    };

    if (!orcamentoSelecionado) {
        return (
            <div className="box" style={{ marginTop: "20px" }}>
                <h2 className="title is-6">Estoque para Lançamento</h2>
                <p className="has-text-grey">Selecione uma peça na tabela acima para visualizar o estoque disponível.</p>
            </div>
        );
    }

    return (
        <div className="box" style={{ marginTop: "20px" }}>
            <h2 className="title is-6">Estoque para Lançamento - {orcamentoSelecionado.partnumber}</h2>

            {/* Mensagem de feedback */}
            {mensagem && (
                <div className={`notification ${tipoMensagem}`} style={{ marginBottom: '15px' }}>
                    {mensagem}
                </div>
            )}

            {loading ? (
                <progress className="progress is-small is-primary" max="100">Carregando...</progress>
            ) : estoques.length === 0 ? (
                <p className="has-text-grey">Nenhum estoque encontrado para o part number {orcamentoSelecionado.partnumber}.</p>
            ) : (
                <>
                    <div className="table-container">
                        <table className="table is-striped is-hoverable is-fullwidth">
                            <thead>
                                <tr>
                                    <th>Part Number</th>
                                    <th>Nome da Peça</th>
                                    <th>Estado</th>
                                    <th>Qtd Estoque</th>
                                    <th>Locação</th>
                                    <th>Sub-locação</th>
                                    <th>idEstoque</th>
                                    <th>idPeca</th>
                                    <th>idLocacao</th>
                                </tr>
                            </thead>
                            <tbody>
                                {estoques.map((estoque) => (
                                    <tr 
                                        key={estoque.id}
                                        onClick={() => handleRowClick(estoque)}
                                        style={{
                                            backgroundColor: estoqueSelecionado?.id === estoque.id ? '#e6f7ff' : 'inherit',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <td>{estoque.peca?.partnumber || '-'}</td>
                                        <td>{estoque.peca?.nome || '-'}</td>
                                        <td>{estoque.peca?.estado || '-'}</td>
                                        <td>{estoque.quantidade || '-'}</td>
                                        <td>{estoque.locacao?.locacao || '-'}</td>
                                        <td>{estoque.locacao?.sub || '-'}</td>
                                        <td>{estoque.id || '-'}</td>
                                        <td>{estoque.peca?.id || '-'}</td>
                                        <td>{estoque.locacao?.id || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Botão Registrar */}
                    <div className="field" style={{ marginTop: '20px' }}>
                        <div className="control">
                            <button
                                onClick={handleRegistrar}
                                className="button is-primary"
                                disabled={!estoqueSelecionado}
                            >
                                Registrar
                            </button>
                            {estoqueSelecionado && (
                                <p className="help">
                                    Registrando baixa de {orcamentoSelecionado.quantidade} unidade(s) do estoque selecionado.
                                </p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};