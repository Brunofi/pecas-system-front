"use client";
import { Layout } from "components/layout";
import 'bulma/css/bulma.css';
import { useEffect, useState } from "react";
import { useChassisService } from "app/services";
import { useEtapaService } from "app/services";
import { Chassis } from "app/models/chassis";
import { Etapa } from "app/models/etapa";
import { Mensagem } from "components/mensagem";
import { TabelaLancarPecasEntregues } from "components/orcamentos";
import { TabelaEstoqueLancamento } from "components/orcamentos/TabelaEstoqueLancamento";
import { Orcamento } from "app/models/orcamento";

export const FormLancarPecasEntregues: React.FC = () => {
    // Estados para os filtros
    const [filtros, setFiltros] = useState({
        chassis: "",
        etapa: ""
    });

    // Estado para orçamento selecionado
    const [orcamentoSelecionado, setOrcamentoSelecionado] = useState<Orcamento | null>(null);

    // Estados para as listas de opções
    const [chassisOptions, setChassisOptions] = useState<Chassis[]>([]);
    const [etapaOptions, setEtapaOptions] = useState<Etapa[]>([]);

    // Estados para mensagens
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState<'is-success' | 'is-danger' | ''>('');

    // Estado para forçar recarregamento da tabela
    const [recarregarKey, setRecarregarKey] = useState(0);

    // Serviços
    const chassisService = useChassisService();
    const etapaService = useEtapaService();

    // Função para recarregar a tabela de orçamentos
    const handleRecarregarOrcamentos = () => {
        setRecarregarKey(prev => prev + 1);
        setOrcamentoSelecionado(null);
    };

    // Carregar opções iniciais
    useEffect(() => {
        const carregarOpcoes = async () => {
            try {
                const [chassis, etapas] = await Promise.all([
                    chassisService.listarChassis(),
                    etapaService.listarEtapas()
                ]);

                setChassisOptions(chassis);
                setEtapaOptions(etapas);
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
        // Limpar seleção quando filtros mudam
        setOrcamentoSelecionado(null);
    };

    const handleOrcamentoSelecionado = (orcamento: Orcamento | null) => {
        setOrcamentoSelecionado(orcamento);
    };

    return (
        <Layout titulo="Lançar Peças Entregues">
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
                </div>
            </div>

            <Mensagem mensagem={mensagem} tipo={tipoMensagem} />

            <TabelaLancarPecasEntregues
                key={recarregarKey}
                filtros={filtros}
                onOrcamentoSelecionado={handleOrcamentoSelecionado}
            />

            <TabelaEstoqueLancamento
                orcamentoSelecionado={orcamentoSelecionado}
                onRegistroSucesso={handleRecarregarOrcamentos}
            />
        </Layout>
    );
};

export default FormLancarPecasEntregues;