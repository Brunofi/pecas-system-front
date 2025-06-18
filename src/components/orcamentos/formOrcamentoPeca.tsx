"use client";
import { Layout } from "components/layout";
import 'bulma/css/bulma.css';
import { useEffect, useState } from "react";
import { TabelaOrcamentoPeca } from "components/orcamentos/TabelaOrcamentoPeca";
import { useChassisService } from "app/services";
import { useEtapaService } from "app/services";
import { useSessaoService } from "app/services";
import { useMotorService } from "app/services";
import { useCambioService } from "app/services";
import { Chassis } from "app/models/chassis";
import { Etapa } from "app/models/etapa";
import { Sessao } from "app/models/sessao";
import { Motor } from "app/models/motor";
import { Cambio } from "app/models/cambio";
import { Mensagem } from "components/mensagem";

export const OrcamentoForm: React.FC = () => {
    // Estados para os filtros superiores
    const [chassisSelecionado, setChassisSelecionado] = useState<string>("");
    const [etapaSelecionada, setEtapaSelecionada] = useState<string>("");
    const [sessaoSelecionada, setSessaoSelecionada] = useState<string>("");
    const [motivo, setMotivo] = useState<string>("");
    const [tipoComponente, setTipoComponente] = useState<"motor" | "cambio">("motor");
    const [componenteSelecionado, setComponenteSelecionado] = useState<string>("");
    
    // Estados para as listas de opções
    const [chassisOptions, setChassisOptions] = useState<Chassis[]>([]);
    const [etapaOptions, setEtapaOptions] = useState<Etapa[]>([]);
    const [sessaoOptions, setSessaoOptions] = useState<Sessao[]>([]);
    const [motorOptions, setMotorOptions] = useState<Motor[]>([]);
    const [cambioOptions, setCambioOptions] = useState<Cambio[]>([]);
    
    // Estados para mensagens
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState<'is-success' | 'is-danger' | ''>('');

    // Serviços
    const chassisService = useChassisService();
    const etapaService = useEtapaService();
    const sessaoService = useSessaoService();
    const motorService = useMotorService();
    const cambioService = useCambioService();

    // Carregar opções iniciais
    useEffect(() => {
        const carregarOpcoes = async () => {
            try {
                const [chassis, etapas, sessoes, motores, cambios] = await Promise.all([
                    chassisService.listarChassis(),
                    etapaService.listarEtapas(),
                    sessaoService.listarSessoes(),
                    motorService.listarMotores(),
                    cambioService.listarCambios()
                ]);
                
                setChassisOptions(chassis);
                setEtapaOptions(etapas);
                setSessaoOptions(sessoes);
                setMotorOptions(motores);
                setCambioOptions(cambios);
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

    const handleCarregar = () => {
        // Lógica para carregar os dados com os filtros aplicados
        // Será implementada posteriormente com a tabela de orçamentos
        mostrarMensagem("Funcionalidade será implementada na próxima etapa", 'is-success');
    };

    const handleSolicitarPeca = (/*peca: Peca, lado: string, quantidade: number*/) => {
        // Lógica para adicionar a peça ao orçamento
        console.log("Peça solicitada:", { /*peca, lado, quantidade*/ });
        mostrarMensagem(`Peça adicionada ao orçamento`, 'is-success');
    };
    

    return (
        <Layout titulo="Solicitação de Orçamento">
            {/* Parte superior - Filtros */}
            <div className="box" style={{ marginBottom: "20px" }}>
                <div className="columns">
                    <div className="column">
                        <div className="field">
                            <label className="label">Chassis</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select 
                                        value={chassisSelecionado} 
                                        onChange={e => setChassisSelecionado(e.target.value)}
                                    >
                                        <option value="">Selecione um chassis</option>
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

                    <div className="column">
                        <div className="field">
                            <label className="label">Etapa</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select 
                                        value={etapaSelecionada} 
                                        onChange={e => setEtapaSelecionada(e.target.value)}
                                    >
                                        <option value="">Selecione uma etapa</option>
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

                    <div className="column">
                        <div className="field">
                            <label className="label">Sessão</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select 
                                        value={sessaoSelecionada} 
                                        onChange={e => setSessaoSelecionada(e.target.value)}
                                    >
                                        <option value="">Selecione uma sessão</option>
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
                </div>

                <div className="columns">
                    <div className="column">
                        <div className="field">
                            <label className="label">Motivo</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select 
                                        value={motivo} 
                                        onChange={e => setMotivo(e.target.value)}
                                    >
                                        <option value="">Selecione um motivo</option>
                                        <option value="AVARIA">Avaria</option>
                                        <option value="MANUTENCAO">Manutenção</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="column">
                        <div className="field">
                            <label className="label">Componente</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select 
                                        value={tipoComponente} 
                                        onChange={e => setTipoComponente(e.target.value as "motor" | "cambio")}
                                    >
                                        <option value="motor">Motor</option>
                                        <option value="cambio">Câmbio</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="column">
                        <div className="field">
                            <label className="label">Número do {tipoComponente === "motor" ? "Motor" : "Câmbio"}</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select 
                                        value={componenteSelecionado} 
                                        onChange={e => setComponenteSelecionado(e.target.value)}
                                    >
                                        <option value="">Selecione um {tipoComponente === "motor" ? "motor" : "câmbio"}</option>
                                        {tipoComponente === "motor" 
                                            ? motorOptions.map(motor => (
                                                <option key={motor.id} value={motor.numeroMotor}>
                                                    {motor.numeroMotor}
                                                </option>
                                              ))
                                            : cambioOptions.map(cambio => (
                                                <option key={cambio.id} value={cambio.numeroCambio}>
                                                    {cambio.numeroCambio}
                                                </option>
                                              ))
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="column is-2">
                        <div className="field" style={{ paddingTop: "1.8rem" }}>
                            <button 
                                onClick={handleCarregar}
                                className="button is-primary is-fullwidth"
                            >
                                Carregar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Mensagem mensagem={mensagem} tipo={tipoMensagem} />

            {/* Tabela de peças para orçamento */}
            <TabelaOrcamentoPeca onSolicitarClick={handleSolicitarPeca} />
        </Layout>
    );
};