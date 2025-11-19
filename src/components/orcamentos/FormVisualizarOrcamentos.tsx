"use client";
import { Layout } from "components/layout";
import 'bulma/css/bulma.css';
import { useEffect, useState } from "react";
import { useChassisService } from "app/services";
import { useEtapaService } from "app/services";
import { useSessaoService } from "app/services";
import { Chassis } from "app/models/chassis";
import { Etapa } from "app/models/etapa";
import { Sessao } from "app/models/sessao";
import { Mensagem } from "components/mensagem";
import { TabelaVisualizarOrcamento } from "components/orcamentos/TabelaVisualizarOrcamento";


export const FormVisualizarOrcamentos: React.FC = () => {
    // Estados para os filtros
    const [filtros, setFiltros] = useState({
        chassis: "",
        etapa: "",
        sessao: "",
        status: ""
    });

    // Estados para as listas de opções
    const [chassisOptions, setChassisOptions] = useState<Chassis[]>([]);
    const [etapaOptions, setEtapaOptions] = useState<Etapa[]>([]);
    const [sessaoOptions, setSessaoOptions] = useState<Sessao[]>([]);

    // Estados para mensagens
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState<'is-success' | 'is-danger' | ''>('');

    // Serviços
    const chassisService = useChassisService();
    const etapaService = useEtapaService();
    const sessaoService = useSessaoService();

    // Carregar opções iniciais
    useEffect(() => {
        const carregarOpcoes = async () => {
            try {
                const [chassis, etapas, sessoes] = await Promise.all([
                    chassisService.listarChassis(),
                    etapaService.listarEtapas(),
                    sessaoService.listarSessoes()
                ]);

                setChassisOptions(chassis);
                setEtapaOptions(etapas);
                setSessaoOptions(sessoes);
            } catch (error: any) {
                mostrarMensagem("Erro ao carregar opções: " + error.message, 'is-danger');
            }
        };

        carregarOpcoes();
    }, []);

    const mostrarMensagem = (mensagem: string, tipo: 'is-success' | 'is-danger') => {
        setMensagem(mensagem);
        setTipoMensagem(tipo);
        setTimeout(() => {
            setMensagem('');
            setTipoMensagem('');
        }, 5000);
    };

    const handleFiltroChange = (campo: string, valor: string) => {
        setFiltros(prev => ({ ...prev, [campo]: valor }));
    };

    const handleCarregar = () => {
        // Aqui você implementará a lógica de carregar os dados
        mostrarMensagem("Filtros aplicados! (Lógica de carregamento será implementada)", 'is-success');
    };

    // Opções de status para o filtro
    const statusOptions = [
        { value: '', label: 'Todos' },
        { value: 'PENDENTE', label: 'Pendente' },
        { value: 'SEPARADA', label: 'Separada' },
        { value: 'ENTREGUE', label: 'Entregue' },
        { value: 'LANCADA', label: 'Lançada' },
        { value: 'CANCELADA', label: 'Cancelada' },
        { value: 'INDISPONIVEL', label: 'Indisponível' },
        { value: 'SOLUCIONADO INTERNO', label: 'Solucionado Interno' },
        { value: 'VALE PECA', label: 'Vale Peça' }
    ];

    return (
        <Layout titulo="Visualizar Orçamentos">
            {/* Parte superior - Filtros */}
            <div className="box" style={{ marginBottom: "20px" }}>
                <h3 className="title is-5" style={{ marginBottom: "20px" }}>Filtros de Busca</h3>
                <div className="columns is-vcentered is-multiline">
                    {/* Chassis */}
                    <div className="column is-narrow">
                        <div className="field">
                            <label className="label is-small">Chassis</label>
                            <div className="control">
                                <div className="select is-small">
                                    <select
                                        value={filtros.chassis}
                                        onChange={e => handleFiltroChange('chassis', e.target.value)}
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

                    {/* Etapa */}
                    <div className="column is-narrow">
                        <div className="field">
                            <label className="label is-small">Etapa</label>
                            <div className="control">
                                <div className="select is-small">
                                    <select
                                        value={filtros.etapa}
                                        onChange={e => handleFiltroChange('etapa', e.target.value)}
                                    >
                                        <option value="">Selecione</option>
                                        {etapaOptions.map(etapa => (
                                            <option key={etapa.id} value={etapa.etapa}>
                                                {etapa.etapa}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sessão */}
                    <div className="column is-narrow">
                        <div className="field">
                            <label className="label is-small">Sessão</label>
                            <div className="control">
                                <div className="select is-small">
                                    <select
                                        value={filtros.sessao}
                                        onChange={e => handleFiltroChange('sessao', e.target.value)}
                                    >
                                        <option value="">Selecione</option>
                                        {sessaoOptions.map(sessao => (
                                            <option key={sessao.id} value={sessao.sessao}>
                                                {sessao.sessao}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="column is-narrow">
                        <div className="field">
                            <label className="label is-small">Status</label>
                            <div className="control">
                                <div className="select is-small">
                                    <select
                                        value={filtros.status}
                                        onChange={e => handleFiltroChange('status', e.target.value)}
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

                    {/* Botão Carregar */}
                    <div className="column">
                        <div className="field">
                            <label className="label is-small">&nbsp;</label>
                            <div className="control">
                                <button
                                    onClick={handleCarregar}
                                    className="button is-primary is-small"
                                >
                                    Carregar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Mensagem mensagem={mensagem} tipo={tipoMensagem} />


            <TabelaVisualizarOrcamento filtros={filtros} />
        </Layout>
    );
};

export default FormVisualizarOrcamentos;