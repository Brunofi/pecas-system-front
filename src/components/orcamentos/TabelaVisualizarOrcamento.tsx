"use client";
import React, { useEffect, useState, useMemo } from "react";
import 'bulma/css/bulma.css';
import { Orcamento } from "app/models/orcamento";
import { useOrcamentoService } from "app/services";
import { useEstoqueService } from "app/services";
import { useChassisService } from "app/services";
import { Estoque } from "app/models/estoque";
import { Chassis } from "app/models/chassis";

type TabelaVisualizarOrcamentoProps = {
    filtros: {
        chassis: string;
        etapa: string;
        sessao: string;
        status: string;
    };
};

export const TabelaVisualizarOrcamento: React.FC<TabelaVisualizarOrcamentoProps> = ({ filtros }) => {
    const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
    const [loading, setLoading] = useState(false);
    const [dadosCarregados, setDadosCarregados] = useState(false);
    const [orcamentoSelecionado, setOrcamentoSelecionado] = useState<Orcamento | null>(null);
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState<'is-success' | 'is-danger' | ''>('');
    const [estoquesPorPartNumber, setEstoquesPorPartNumber] = useState<Map<string, Estoque[]>>(new Map());

    // Estados para alteração de status
    const [novoStatus, setNovoStatus] = useState<string>('');
    const [chassisSelecionado, setChassisSelecionado] = useState<string>('');
    const [estadoPeca, setEstadoPeca] = useState<string>('');
    const [chassisOptions, setChassisOptions] = useState<Chassis[]>([]);

    const orcamentoService = useOrcamentoService();
    const estoqueService = useEstoqueService();
    const chassisService = useChassisService();

    // Função para identificar partNumbers repetidos
    const partNumbersRepetidos = useMemo(() => {
        if (!Array.isArray(orcamentos)) return [];

        const partNumberCounts: { [key: string]: number } = {};

        // Conta a ocorrência de cada partNumber
        orcamentos.forEach(orcamento => {
            if (orcamento.partnumber) {
                partNumberCounts[orcamento.partnumber] = (partNumberCounts[orcamento.partnumber] || 0) + 1;
            }
        });

        // Retorna apenas os partNumbers que aparecem mais de uma vez
        return Object.keys(partNumberCounts).filter(partNumber => partNumberCounts[partNumber] > 1);
    }, [orcamentos]);

    // Função para verificar se um orçamento tem partNumber repetido
    const temPartNumberRepetido = (orcamento: Orcamento): boolean => {
        if (!orcamento.partnumber) return false;
        return partNumbersRepetidos.includes(orcamento.partnumber);
    };

    // Carregar opções de chassis
    useEffect(() => {
        const carregarChassis = async () => {
            try {
                const chassis = await chassisService.listarChassis();
                setChassisOptions(chassis);
            } catch (error) {
                console.error("Erro ao carregar chassis:", error);
            }
        };
        carregarChassis();
    }, []);

    // Função para carregar os orçamentos
    const carregarOrcamentos = async () => {
        try {
            setLoading(true);
            setDadosCarregados(false);

            // VALIDAÇÃO: Só faz a requisição se pelo menos um filtro estiver preenchido
            const filtrosPreenchidos = Object.values(filtros).some(valor =>
                valor && valor.trim() !== ''
            );

            if (!filtrosPreenchidos) {
                setOrcamentos([]);
                setDadosCarregados(true);
                setLoading(false);
                return;
            }

            // Usa o NOVO método flexível
            const dados = await orcamentoService.listarPorFiltrosFlexiveis({
                chassis: filtros.chassis || undefined,
                etapa: filtros.etapa || undefined,
                sessao: filtros.sessao || undefined,
                status: filtros.status || undefined
            });

            const listaDados = Array.isArray(dados) ? dados : [];

            // Filtragem adicional por status (se necessário)
            let dadosFiltrados = listaDados;
            if (filtros.status) {
                dadosFiltrados = listaDados.filter(orc => orc.statusPeca === filtros.status);
            }

            setOrcamentos(dadosFiltrados);
            setDadosCarregados(true);

            // Buscar informações de estoque (mantido igual)
            if (dadosFiltrados.length > 0) {
                const partNumbersUnicos = [...new Set(dadosFiltrados.map(orc => orc.partnumber).filter(Boolean))];
                const estoquesMap = new Map<string, Estoque[]>();

                try {
                    const promessasEstoques = partNumbersUnicos.map(async (partNumber) => {
                        if (partNumber) {
                            try {
                                const estoques = await estoqueService.buscarEstoquesPorPartNumber(partNumber);
                                estoquesMap.set(partNumber, estoques);
                            } catch (error) {
                                console.error(`Erro ao buscar estoque para ${partNumber}:`, error);
                                estoquesMap.set(partNumber, []);
                            }
                        }
                    });

                    await Promise.all(promessasEstoques);
                    setEstoquesPorPartNumber(estoquesMap);
                } catch (error) {
                    console.error("Erro ao buscar estoques:", error);
                }
            }

        } catch (error: any) {
            console.error("Erro ao carregar orçamentos:", error);
            mostrarMensagem("Erro ao carregar orçamentos: " + error.message, 'is-danger');
            setOrcamentos([]);
        } finally {
            setLoading(false);
        }
    };

    // Carregar quando filtros mudam
    useEffect(() => {
        // Debounce para evitar muitas requisições
        const timeoutId = setTimeout(() => {
            carregarOrcamentos();
        }, 300); // Aguarda 300ms após a última alteração

        return () => clearTimeout(timeoutId);
    }, [filtros.chassis, filtros.etapa, filtros.sessao, filtros.status]);

    const mostrarMensagem = (mensagem: string, tipo: 'is-success' | 'is-danger') => {
        setMensagem(mensagem);
        setTipoMensagem(tipo);
        setTimeout(() => {
            setMensagem('');
            setTipoMensagem('');
        }, 5000);
    };

    // Função para obter quantidade total de estoque e locações para um partNumber
    const getInfoEstoque = (partNumber?: string) => {
        if (!partNumber) return { quantidadeTotal: 0, locacoes: '-' };

        const estoques = estoquesPorPartNumber.get(partNumber) || [];
        const quantidadeTotal = estoques.reduce((sum, estoque) => sum + (estoque.quantidade || 0), 0);
        const locacoes = estoques
            .map(estoque => estoque.locacao?.locacao)
            .filter(Boolean)
            .join(', ');

        return {
            quantidadeTotal,
            locacoes: locacoes || '-'
        };
    };

    // Função para obter a cor do status
    const getStatusColor = (status?: string) => {
        if (!status) return 'is-light';

        // Verifica se é VALE-PEÇA (pode estar concatenado com chassis)
        if (status.startsWith('VALE-PEÇA') || status.startsWith('VALE PECA')) {
            return 'is-success';
        }

        switch (status) {
            case 'PENDENTE':
                return 'is-warning';
            case 'SEPARADA':
                return 'is-info';
            case 'ENTREGUE':
            case 'LANCADA':
                return 'is-success';
            case 'CANCELADA':
                return 'is-danger';
            case 'INDISPONIVEL':
                return 'is-danger';
            case 'SOLUCIONADO INTERNO':
                return 'is-success';
            default:
                return 'is-light';
        }
    };

    // Função para alterar status
    const handleAlterarStatus = async () => {
        if (!orcamentoSelecionado || !orcamentoSelecionado.id) {
            mostrarMensagem("Selecione um orçamento na tabela", 'is-danger');
            return;
        }

        if (!novoStatus) {
            mostrarMensagem("Selecione um status para alterar", 'is-danger');
            return;
        }

        // Validações específicas
        if (novoStatus === 'VALE PECA' && !chassisSelecionado) {
            mostrarMensagem("Selecione um chassis para VALE-PEÇA", 'is-danger');
            return;
        }

        if (novoStatus === 'ENTREGUE' && !estadoPeca) {
            mostrarMensagem("Selecione o estado da peça para ENTREGUE", 'is-danger');
            return;
        }

        try {
            // Preparar dados para atualização
            let statusFinal = novoStatus;

            // Se for VALE-PEÇA, concatenar com o chassis de onde a peça foi retirada
            if (novoStatus === 'VALE PECA' && chassisSelecionado) {
                statusFinal = `VALE-PEÇA (${chassisSelecionado})`;
            }

            const nomeUsuario = localStorage.getItem('usuario_logado') || localStorage.getItem('nome') || 'Usuário Desconhecido';

            const orcamentoAtualizado: Orcamento = {
                ...orcamentoSelecionado,
                statusPeca: statusFinal as any,
                estadoPeca: novoStatus === 'ENTREGUE' ? estadoPeca : orcamentoSelecionado.estadoPeca,
                colaboradorEntrega: nomeUsuario
            };

            const mensagemSucesso = await orcamentoService.atualizar(orcamentoAtualizado);
            mostrarMensagem(mensagemSucesso, 'is-success');

            // Limpar seleções
            setNovoStatus('');
            setChassisSelecionado('');
            setEstadoPeca('');
            setOrcamentoSelecionado(null);

            // Recarregar lista
            carregarOrcamentos();

        } catch (error: any) {
            mostrarMensagem(error.message || "Erro ao alterar status", 'is-danger');
        }
    };

    // Opções de status para alteração
    const statusOptions = [
        { value: '', label: 'Selecione um status' },
        { value: 'SEPARADA', label: 'SEPARADA' },
        { value: 'ENTREGUE', label: 'ENTREGUE' },
        { value: 'INDISPONIVEL', label: 'INDISPONIVEL' },
        { value: 'CANCELADA', label: 'CANCELADA' },
        { value: 'SOLUCIONADO INTERNO', label: 'SOLUCIONADO INTERNO' },
        { value: 'VALE PECA', label: 'VALE-PEÇA' }
    ];

    // Opções de estado da peça
    const estadoPecaOptions = [
        { value: '', label: 'Selecione' },
        { value: 'NOVA', label: 'NOVA' },
        { value: 'REC', label: 'REC' },
        { value: 'FN', label: 'FN' }
    ];

    return (
        <div className="box" style={{ marginTop: "20px" }}>
            <h2 className="title is-6">Peças Solicitadas</h2>

            {/* Mensagem informativa sobre partNumbers repetidos */}
            {partNumbersRepetidos.length > 0 && (
                <div className="notification is-warning is-light" style={{ marginBottom: '15px' }}>
                    <strong>Atenção:</strong> Existem partNumbers repetidos na lista (destacados em amarelo).
                    PartNumbers repetidos: <strong>{partNumbersRepetidos.join(', ')}</strong>
                </div>
            )}

            {/* Mensagem de feedback */}
            {mensagem && (
                <div className={`notification ${tipoMensagem}`} style={{ marginBottom: '15px' }}>
                    {mensagem}
                </div>
            )}

            {loading ? (
                <progress className="progress is-small is-primary" max="100">Carregando...</progress>
            ) : !dadosCarregados && !loading ? (
                <p className="has-text-grey">Selecione um ou mais filtros para visualizar os orçamentos.</p>
            ) : orcamentos.length === 0 && dadosCarregados ? (
                <p className="has-text-grey">Nenhum orçamento encontrado com os filtros selecionados.</p>
            ) : (
                <>
                    <div className="table-container">
                        <table className="table is-striped is-hoverable is-fullwidth">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Part Number</th>
                                    <th>Nome Peça</th>
                                    <th>Qtd Pedida</th>
                                    <th>Motivo</th>
                                    <th>Chassis</th>
                                    <th>Qtd Estoque</th>
                                    <th>Locação</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orcamentos.map((orcamento) => {
                                    const isRepetido = temPartNumberRepetido(orcamento);
                                    const isSelecionado = orcamentoSelecionado?.id === orcamento.id;

                                    return (
                                        <tr
                                            key={orcamento.id}
                                            onClick={() => setOrcamentoSelecionado(orcamento)}
                                            style={{
                                                backgroundColor: isSelecionado
                                                    ? '#e6f7ff' // Azul claro para selecionado
                                                    : isRepetido
                                                        ? '#fffbf0' // Amarelo bem suave para repetidos
                                                        : 'inherit',
                                                borderLeft: isRepetido ? '4px solid #ffdd57' : 'none',
                                                cursor: 'pointer'
                                            }}
                                            className={isRepetido ? 'has-background-warning-light' : ''}
                                        >
                                            <td>{orcamento.id || '-'}</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {orcamento.partnumber || '-'}
                                                    {isRepetido && (
                                                        <span
                                                            className="tag is-warning is-small"
                                                            title="Part Number repetido - Verificar se é intencional"
                                                        >
                                                            ⚠
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>{orcamento.nomePeca || '-'}</td>
                                            <td>{orcamento.quantidade || '-'}</td>
                                            <td>{orcamento.motivoConsumo || '-'}</td>
                                            <td>{orcamento.chassis || '-'}</td>
                                            <td>{getInfoEstoque(orcamento.partnumber).quantidadeTotal}</td>
                                            <td>{getInfoEstoque(orcamento.partnumber).locacoes}</td>
                                            <td>
                                                <span className={`tag ${getStatusColor(orcamento.statusPeca)}`}>
                                                    {orcamento.statusPeca || 'PENDENTE'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Área de alteração de status */}
                    {orcamentoSelecionado && (
                        <div className="box" style={{ marginTop: '20px', backgroundColor: '#f5f5f5' }}>
                            <h3 className="title is-6">Alterar Status - Orçamento ID: {orcamentoSelecionado.id}</h3>

                            <div className="columns is-vcentered is-multiline">
                                {/* Seleção de Status */}
                                <div className="column is-narrow">
                                    <div className="field">
                                        <label className="label is-small">Novo Status</label>
                                        <div className="control">
                                            <div className="select is-small">
                                                <select
                                                    value={novoStatus}
                                                    onChange={(e) => {
                                                        setNovoStatus(e.target.value);
                                                        // Limpar campos condicionais ao mudar status
                                                        setChassisSelecionado('');
                                                        setEstadoPeca('');
                                                    }}
                                                >
                                                    {statusOptions.map(status => (
                                                        <option key={status.value} value={status.value}>
                                                            {status.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Campo condicional: Chassis para VALE-PEÇA */}
                                {novoStatus === 'VALE PECA' && (
                                    <div className="column is-narrow">
                                        <div className="field">
                                            <label className="label is-small">Chassis *</label>
                                            <div className="control">
                                                <div className="select is-small">
                                                    <select
                                                        value={chassisSelecionado}
                                                        onChange={(e) => setChassisSelecionado(e.target.value)}
                                                    >
                                                        <option value="">Selecione</option>
                                                        {chassisOptions.map(chassi => (
                                                            <option key={chassi.id} value={chassi.numeral}>
                                                                {chassi.numeral}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Campo condicional: Estado da Peça para ENTREGUE */}
                                {novoStatus === 'ENTREGUE' && (
                                    <div className="column is-narrow">
                                        <div className="field">
                                            <label className="label is-small">Estado da Peça *</label>
                                            <div className="control">
                                                <div className="select is-small">
                                                    <select
                                                        value={estadoPeca}
                                                        onChange={(e) => setEstadoPeca(e.target.value)}
                                                    >
                                                        {estadoPecaOptions.map(estado => (
                                                            <option key={estado.value} value={estado.value}>
                                                                {estado.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Botão Alterar Status */}
                                <div className="column is-narrow">
                                    <div className="field">
                                        <label className="label is-small">&nbsp;</label>
                                        <div className="control">
                                            <button
                                                onClick={handleAlterarStatus}
                                                className="button is-primary is-small"
                                            >
                                                Alterar Status
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};