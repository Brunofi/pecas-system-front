import React, { useState } from 'react';
import { useEstoqueService } from 'app/services/estoque.service';
import { Estoque } from 'app/models/estoque';
import { Mensagem } from 'components/mensagem/mensagem';

export const FormMovimentacaoLocacao: React.FC = () => {
    const service = useEstoqueService();

    // States
    const [termoBusca, setTermoBusca] = useState('');
    const [resultados, setResultados] = useState<Estoque[]>([]);
    const [origem, setOrigem] = useState<Estoque | null>(null);
    const [destino, setDestino] = useState<Estoque | null>(null);
    const [quantidade, setQuantidade] = useState<number | ''>('');
    const [mensagem, setMensagem] = useState<string>('');
    const [tipoMensagem, setTipoMensagem] = useState<'is-success' | 'is-danger' | ''>('');

    // Functions
    const handleBuscar = async () => {
        if (!termoBusca) return;
        setMensagem('');
        try {
            // Tenta buscar por PartNumber primeiro, depois por nome se falhar ou retornar vazio? 
            // O requisito diz "Input para pesquisar a peça (por PartNumber ou Nome)"
            // Vamos tentar uma estratégia mista ou dois botões, mas para UX limpa, vamos assumir que se parece com PN busca PN.

            // Simplificação: vamos buscar por PartNumber se contiver números e letras, ou nome se for mais texto. 
            // Ou melhor, chamamos um e se vazio chamamos o outro?
            // O backend controller tem endpoints separados.

            let data: Estoque[] = [];
            try {
                data = await service.buscarEstoquesPorPartNumber(termoBusca);
            } catch {
                // Se der erro ou vazio, tenta nome
                data = await service.buscarEstoquesPorNome(termoBusca);
            }

            // Se falhar a primeira e cair no catch, tenta a segunda. 
            // Mas o service lança erro se não achar? O service lança erro.
            // Vamos tentar um try/catch mais robusto.

            setResultados(data);
            if (data.length === 0) {
                // Tenta por nome se o primeiro retornou vazio (sem erro, mas vazio)
                const dataNome = await service.buscarEstoquesPorNome(termoBusca);
                setResultados(dataNome);
                if (dataNome.length === 0) {
                    setMensagem('Nenhum registro encontrado.');
                    setTipoMensagem('is-danger');
                }
            }

        } catch (error: any) {
            // Se deu erro no primeiro (ex: 404), tenta o segundo
            try {
                const dataNome = await service.buscarEstoquesPorNome(termoBusca);
                setResultados(dataNome);
            } catch (e) {
                setMensagem('Erro ao buscar ou nenhum registro encontrado.');
                setTipoMensagem('is-danger');
                setResultados([]); // Limpa
            }
        }
    };

    // Melhorando a busca: O service joga erro se não acha?
    // O service joga erro. Então o flow acima está "ok".
    // Vamos refazer search logic pra ser mais direta.

    const realizarBusca = async () => {
        setMensagem('');
        setResultados([]);
        setOrigem(null);
        setDestino(null);

        try {
            // Tenta buscar por PartNumber
            const resPart = await service.buscarEstoquesPorPartNumber(termoBusca);
            if (resPart && resPart.length > 0) {
                setResultados(resPart);
                return;
            }
        } catch (e) {
            // Ignora erro do partnumber e tenta nome
        }

        try {
            const resNome = await service.buscarEstoquesPorNome(termoBusca);
            setResultados(resNome);
            if (resNome.length === 0) {
                setMensagem('Nenhum resultado encontrado.');
                setTipoMensagem('is-danger');
            }
        } catch (e: any) {
            setMensagem(e.message);
            setTipoMensagem('is-danger');
        }
    };


    const handleMovimentar = async () => {
        setMensagem('');
        setTipoMensagem('');

        if (!origem || !destino) {
            setMensagem('Selecione uma origem e um destino.');
            setTipoMensagem('is-danger');
            return;
        }

        const qtd = Number(quantidade);
        if (!quantidade || isNaN(qtd) || qtd <= 0) {
            setMensagem('A quantidade deve ser um número maior que zero.');
            setTipoMensagem('is-danger');
            return;
        }

        try {
            if (qtd > (origem.quantidade || 0)) {
                throw new Error('Quantidade superior ao saldo da origem.');
            }

            // Validações de Negócio
            const origemPecaId = origem.peca?.id;
            const destinoPecaId = destino.peca?.id;

            if (origemPecaId !== destinoPecaId) {
                throw new Error('As peças selecionadas são incompatíveis (IDs diferentes).');
            }

            if (origem.id === destino.id) {
                throw new Error('A origem e o destino não podem ser a mesma locação.');
            }

            // Validação final crítica antes do envio
            if (!origem.id || !destino.id) {
                throw new Error('Erro crítico: ID da locação de origem ou destino inválido.');
            }

            const msg = await service.movimentarEntreLocacoes(origem.id, destino.id, qtd);

            setMensagem(msg);
            setTipoMensagem('is-success');
            setQuantidade('');
            setOrigem(null);
            setDestino(null);
            realizarBusca();
        } catch (error: any) {
            setMensagem(error.message || 'Erro ao movimentar.');
            setTipoMensagem('is-danger');
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="title is-4">Movimentação entre Locações</h1>

            <div className="columns">
                <div className="column is-three-quarters">
                    <div className="field has-addons">
                        <div className="control is-expanded">
                            <input
                                className="input"
                                type="text"
                                placeholder="Pesquisar por PartNumber ou Nome da Peça"
                                value={termoBusca}
                                onChange={e => setTermoBusca(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && realizarBusca()}
                            />
                        </div>
                        <div className="control">
                            <button className="button is-info" onClick={realizarBusca}>
                                Buscar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Mensagem mensagem={mensagem} tipo={tipoMensagem} />

            {resultados.length > 0 && (
                <div className="columns">
                    {/* Tabela Origem */}
                    <div className="column is-half">
                        <h2 className="subtitle is-6 has-text-danger-dark font-bold">SELECIONE A LOCAÇÃO DE ORIGEM (DÉBITO) - {origem ? `ID: ${origem.id}` : ''}</h2>
                        <div className="table-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                                <thead>
                                    <tr>
                                        <th>PN</th>
                                        <th>Nome</th>
                                        <th>Est</th>
                                        <th>Qtd</th>
                                        <th>Locação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultados.map(est => (
                                        <tr
                                            key={`origem-${est.id}`}
                                            onClick={() => setOrigem(est)}
                                            style={{ cursor: 'pointer', backgroundColor: origem?.id === est.id ? '#fdecea' : '' }}
                                            className={origem?.id === est.id ? 'is-selected' : ''}
                                        >
                                            <td>{est.peca?.partnumber}</td>
                                            <td>{est.peca?.nome}</td>
                                            <td>{est.peca?.estado}</td>
                                            <td className="has-text-weight-bold">{est.quantidade}</td>
                                            <td>{est.locacao?.locacao}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Tabela Destino */}
                    <div className="column is-half">
                        <h2 className="subtitle is-6 has-text-success-dark font-bold">SELECIONE A LOCAÇÃO DE DESTINO (CRÉDITO) - {destino ? `ID: ${destino.id}` : ''}</h2>
                        <div className="table-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                                <thead>
                                    <tr>
                                        <th>PN</th>
                                        <th>Nome</th>
                                        <th>Est</th>
                                        <th>Qtd</th>
                                        <th>Locação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultados.map(est => (
                                        <tr
                                            key={`destino-${est.id}`}
                                            onClick={() => setDestino(est)}
                                            style={{ cursor: 'pointer', backgroundColor: destino?.id === est.id ? '#eafdf0' : '' }}
                                            className={destino?.id === est.id ? 'is-selected' : ''}
                                        >
                                            <td>{est.peca?.partnumber}</td>
                                            <td>{est.peca?.nome}</td>
                                            <td>{est.peca?.estado}</td>
                                            <td className="has-text-weight-bold">{est.quantidade}</td>
                                            <td>{est.locacao?.locacao}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {resultados.length > 0 && (
                <div className="box has-background-light">
                    <div className="columns is-vcentered">
                        <div className="column is-narrow">
                            <label className="label">Quantidade a Mover:</label>
                        </div>
                        <div className="column is-narrow">
                            <input
                                className="input"
                                type="number"
                                min="1"
                                placeholder="Qtd"
                                value={quantidade}
                                onChange={e => setQuantidade(e.target.value === '' ? '' : Number(e.target.value))}
                            />
                        </div>
                        <div className="column">
                            <button
                                className="button is-primary is-fullwidth"
                                onClick={handleMovimentar}
                                disabled={!origem || !destino || !quantidade}
                            >
                                Confirmar Movimentação
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};
