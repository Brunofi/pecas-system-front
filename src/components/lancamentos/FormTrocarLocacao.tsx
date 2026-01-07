import React, { useState } from 'react';
import { useEstoqueService } from 'app/services/estoque.service';
import { useLocacaoService } from 'app/services/locacao.service';
import { Estoque } from 'app/models/estoque';
import { Locacao } from 'app/models/locacao';
import { Mensagem } from 'components/mensagem/mensagem';

export const FormTrocarLocacao: React.FC = () => {
    const estoqueService = useEstoqueService();
    const locacaoService = useLocacaoService();

    // States - Busca Peça
    const [termoBuscaPeca, setTermoBuscaPeca] = useState('');
    const [resultadosPeca, setResultadosPeca] = useState<Estoque[]>([]);
    const [estoqueSelecionado, setEstoqueSelecionado] = useState<Estoque | null>(null);

    // States - Busca Locação
    const [termoBuscaLocacao, setTermoBuscaLocacao] = useState('');
    const [resultadosLocacao, setResultadosLocacao] = useState<Locacao[]>([]);
    const [locacaoSelecionada, setLocacaoSelecionada] = useState<Locacao | null>(null);

    // States - Feedback
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState<'is-success' | 'is-danger' | ''>('');

    // Functions
    const buscarPecas = async () => {
        setMensagem('');
        try {
            const data = await estoqueService.buscarEstoquesPorPartNumber(termoBuscaPeca);
            setResultadosPeca(data);
            setEstoqueSelecionado(null);
        } catch (error: any) {
            setResultadosPeca([]);
            setMensagem('Erro ao buscar peças: ' + (error.message || 'Erro desconhecido'));
            setTipoMensagem('is-danger');
        }
    };

    const buscarLocacoes = async () => {
        setMensagem('');
        try {
            const data = await locacaoService.buscarLocacoes(termoBuscaLocacao);
            setResultadosLocacao(data);
            setLocacaoSelecionada(null);
        } catch (error: any) {
            setResultadosLocacao([]);
            setMensagem('Erro ao buscar locações: ' + (error.message || 'Erro desconhecido'));
            setTipoMensagem('is-danger');
        }
    };

    const handleConfirmar = async () => {
        if (!estoqueSelecionado || !locacaoSelecionada) return;

        try {
            const msg = await estoqueService.trocarLocacao(estoqueSelecionado.id!, locacaoSelecionada.id!);
            setMensagem(msg);
            setTipoMensagem('is-success');

            // Limpa seleções
            setEstoqueSelecionado(null);
            setLocacaoSelecionada(null);
            setResultadosPeca([]);
            setResultadosLocacao([]);
            setTermoBuscaPeca('');
            setTermoBuscaLocacao('');

        } catch (error: any) {
            setMensagem(error.message || 'Erro ao realizar a troca.');
            setTipoMensagem('is-danger');
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="title is-4">Trocar Peça de Locação</h1>
            <Mensagem mensagem={mensagem} tipo={tipoMensagem} />

            <div className="columns">
                {/* Lado Esquerdo - Estoque/Peça */}
                <div className="column is-half">
                    <div className="box">
                        <h2 className="subtitle is-6 has-text-weight-bold has-text-info">1. Selecionar Estoque (Origem)</h2>
                        <div className="field has-addons">
                            <div className="control is-expanded">
                                <input
                                    className="input"
                                    type="text"
                                    placeholder="Part Number"
                                    value={termoBuscaPeca}
                                    onChange={e => setTermoBuscaPeca(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && buscarPecas()}
                                />
                            </div>
                            <div className="control">
                                <button className="button is-info" onClick={buscarPecas}>Buscar</button>
                            </div>
                        </div>

                        <div className="table-container" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                                <thead>
                                    <tr>
                                        <th>PN</th>
                                        <th>Nome</th>
                                        <th>Qtd</th>
                                        <th>Locação Atual</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultadosPeca.map(est => (
                                        <tr
                                            key={est.id}
                                            onClick={() => setEstoqueSelecionado(est)}
                                            className={estoqueSelecionado?.id === est.id ? 'is-selected' : ''}
                                            style={{ cursor: 'pointer', backgroundColor: estoqueSelecionado?.id === est.id ? '#effaf5' : '' }}
                                        >
                                            <td>{est.peca?.partnumber}</td>
                                            <td>{est.peca?.nome}</td>
                                            <td>{est.quantidade}</td>
                                            <td>{est.locacao?.locacao} - {est.locacao?.sub}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {estoqueSelecionado && (
                            <div className="notification is-info is-light mt-4">
                                <strong>Selecionado: </strong> {estoqueSelecionado.peca?.partnumber} - {estoqueSelecionado.peca?.nome}
                            </div>
                        )}
                    </div>
                </div>

                {/* Lado Direito - Nova Locação */}
                <div className="column is-half">
                    <div className="box">
                        <h2 className="subtitle is-6 has-text-weight-bold has-text-success">2. Selecionar Nova Locação (Destino)</h2>
                        <div className="field has-addons">
                            <div className="control is-expanded">
                                <input
                                    className="input"
                                    type="text"
                                    placeholder="Nome da Locação"
                                    value={termoBuscaLocacao}
                                    onChange={e => setTermoBuscaLocacao(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && buscarLocacoes()}
                                />
                            </div>
                            <div className="control">
                                <button className="button is-info" onClick={buscarLocacoes}>Buscar</button>
                            </div>
                        </div>

                        <div className="table-container" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Locação</th>
                                        <th>Sub-Locação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultadosLocacao.map(loc => (
                                        <tr
                                            key={loc.id}
                                            onClick={() => setLocacaoSelecionada(loc)}
                                            className={locacaoSelecionada?.id === loc.id ? 'is-selected' : ''}
                                            style={{ cursor: 'pointer', backgroundColor: locacaoSelecionada?.id === loc.id ? '#effaf5' : '' }}
                                        >
                                            <td>{loc.id}</td>
                                            <td>{loc.locacao}</td>
                                            <td>{loc.sub}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {locacaoSelecionada && (
                            <div className="notification is-success is-light mt-4">
                                <strong>Selecionado: </strong> {locacaoSelecionada.locacao} - {locacaoSelecionada.sub}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="has-text-centered mt-4">
                <button
                    className="button is-primary is-large"
                    onClick={handleConfirmar}
                    disabled={!estoqueSelecionado || !locacaoSelecionada}
                >
                    Confirmar Troca de Locação
                </button>
            </div>
        </div>
    );
};
