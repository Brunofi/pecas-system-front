import { useState, useEffect } from 'react';
import { useSaidaService, useChassisService, useEtapaService } from 'app/services';
import { Saida } from 'app/models/saida';
import { Chassis } from 'app/models/chassis';
import { Etapa } from 'app/models/etapa';
import { Mensagem } from 'components/mensagem';

export const FormDesfazerLancamento = () => {
    const saidaService = useSaidaService();
    const chassisService = useChassisService();
    const etapaService = useEtapaService();

    const [chassis, setChassis] = useState('');
    const [etapa, setEtapa] = useState('');
    const [lancamentos, setLancamentos] = useState<Saida[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [mensagem, setMensagem] = useState<{ texto: string; tipo: 'is-success' | 'is-danger' } | null>(null);

    // Options for dropdowns
    const [chassisOptions, setChassisOptions] = useState<Chassis[]>([]);
    const [etapaOptions, setEtapaOptions] = useState<Etapa[]>([]);

    useEffect(() => {
        const carregarOpcoes = async () => {
            try {
                const [listaChassis, listaEtapas] = await Promise.all([
                    chassisService.listarChassis(),
                    etapaService.listarEtapas()
                ]);
                setChassisOptions(listaChassis);
                setEtapaOptions(listaEtapas);
            } catch (error: any) {
                setMensagem({ texto: 'Erro ao carregar opções: ' + error.message, tipo: 'is-danger' });
            }
        };
        carregarOpcoes();
    }, []);

    const handleBuscar = async () => {
        if (!chassis || !etapa) {
            setMensagem({ texto: 'Chassis e Etapa são obrigatórios.', tipo: 'is-danger' });
            return;
        }
        try {
            const resultados = await saidaService.buscarLancamentos(chassis, etapa);
            setLancamentos(resultados);
            setMensagem(null);
            setSelectedId(null);
            if (resultados.length === 0) {
                setMensagem({ texto: 'Nenhum lançamento encontrado.', tipo: 'is-danger' });
            }
        } catch (error: any) {
            setMensagem({ texto: error.message, tipo: 'is-danger' });
        }
    };

    const handleDesfazer = async () => {
        if (!selectedId) return;

        if (confirm('Tem certeza que deseja desfazer este lançamento? O estoque será devolvido.')) {
            try {
                const msg = await saidaService.desfazerLancamento(selectedId);
                setMensagem({ texto: msg, tipo: 'is-success' });
                handleBuscar(); // Atualiza a lista
            } catch (error: any) {
                setMensagem({ texto: error.message, tipo: 'is-danger' });
            }
        }
    };

    return (
        <div className="box">
            <h1 className="title is-4">Desfazer Lançamento de Saída</h1>

            {mensagem && <Mensagem mensagem={mensagem.texto} tipo={mensagem.tipo} />}

            <div className="columns">
                <div className="column">
                    <div className="field">
                        <label className="label">Chassis</label>
                        <div className="control">
                            <div className="select is-fullwidth">
                                <select
                                    value={chassis}
                                    onChange={e => setChassis(e.target.value)}
                                >
                                    <option value="">Selecione o Chassis</option>
                                    {chassisOptions.map(opcao => (
                                        <option key={opcao.id} value={opcao.numeral}>
                                            {opcao.numeral}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="column">
                    <div className="field">
                        <label className="label">Etapa</label>
                        <div className="control">
                            <div className="select is-fullwidth">
                                <select
                                    value={etapa}
                                    onChange={e => setEtapa(e.target.value)}
                                >
                                    <option value="">Selecione a Etapa</option>
                                    {etapaOptions.map(opcao => (
                                        <option key={opcao.id} value={opcao.etapa}>
                                            {opcao.etapa}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="column is-narrow">
                    <div className="field">
                        <label className="label">&nbsp;</label>
                        <div className="control">
                            <button className="button is-info" onClick={handleBuscar}>
                                Buscar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {lancamentos.length > 0 && (
                <div className="table-container">
                    <table className="table is-striped is-fullwidth is-hoverable">
                        <thead>
                            <tr>
                                <th>PartNumber</th>
                                <th>Peça</th>
                                <th>Estado</th>
                                <th>Qtd</th>
                                <th>Motivo</th>
                                <th>Chassis</th>
                                <th>Etapa</th>
                                <th>ID Saída</th>
                                <th>ID Estoque</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lancamentos.map(saida => (
                                <tr
                                    key={saida.id}
                                    className={selectedId === saida.id ? 'is-selected' : ''}
                                    onClick={() => saida.id && setSelectedId(saida.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td>{saida.peca?.partnumber}</td>
                                    <td>{saida.peca?.nome}</td>
                                    <td>{saida.peca?.estado}</td>
                                    <td>{saida.quantidade}</td>
                                    <td>{saida.motivoConsumo}</td>
                                    <td>{saida.chassis}</td>
                                    <td>{saida.etapa}</td>
                                    <td>{saida.id}</td>
                                    <td>{saida.estoque?.id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedId && (
                <div className="field is-grouped is-grouped-right">
                    <div className="control">
                        <button className="button is-danger" onClick={handleDesfazer}>
                            Desfazer Lançamento
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
