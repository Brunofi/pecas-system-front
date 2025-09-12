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
import { Orcamento } from "app/models/orcamento";
import { TabelaSolicitacoes } from "components/orcamentos/TabelaSolicitacoes";

export const OrcamentoForm: React.FC = () => {
    // Estados para os filtros
    const [filtros, setFiltros] = useState({
        chassis: "",
        etapa: "",
        sessao: "",
        motivo: "",
        tipoComponente: "motor" as "motor" | "cambio",
        componente: ""
    });

    // Estado para controlar quais campos foram tocados/validados
    const [camposTocados, setCamposTocados] = useState({
        chassis: false,
        etapa: false,
        sessao: false,  // Adicionado
        motivo: false   // Adicionado

    });

    // Estados para as listas de opções
    const [chassisOptions, setChassisOptions] = useState<Chassis[]>([]);
    const [etapaOptions, setEtapaOptions] = useState<Etapa[]>([]);
    const [sessaoOptions, setSessaoOptions] = useState<Sessao[]>([]);
    const [motorOptions, setMotorOptions] = useState<Motor[]>([]);
    const [cambioOptions, setCambioOptions] = useState<Cambio[]>([]);
    const [ultimaSolicitacao, setUltimaSolicitacao] = useState<Orcamento | null>(null);
    const [validacaoSolicitacao, setValidacaoSolicitacao] = useState(false);

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

    const handleFiltroChange = (campo: string, valor: string) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
    
    // Marca o campo como tocado para mostrar validação
    if (campo in camposTocados) {
        setCamposTocados(prev => ({ ...prev, [campo]: true }));
    }
};

   const handleCarregar = () => {
    // Marca apenas os campos obrigatórios como tocados
    setCamposTocados({
        chassis: true,
        etapa: true,
        sessao: false,  // Mantém false para busca
        motivo: false   // Mantém false para busca
    });
    setValidacaoSolicitacao(false); // Importante: não é validação para solicitação

    // Validação apenas dos campos obrigatórios
    const camposFaltantes = [];
    if (!filtros.chassis) camposFaltantes.push("Chassis");
    if (!filtros.etapa) camposFaltantes.push("Etapa");

    if (camposFaltantes.length > 0) {
        mostrarMensagem(`Preencha os campos obrigatórios: ${camposFaltantes.join(', ')}`, 'is-danger');
        return;
    }

    mostrarMensagem("Dados carregados com base nos filtros!", 'is-success');
};

    const handleSolicitarPeca = (orcamento: Orcamento) => {
        console.log("Orçamento criado:", orcamento);
        mostrarMensagem(`Peça ${orcamento.partnumber} solicitada com sucesso!`, 'is-success');
        setUltimaSolicitacao(orcamento);
    };



    // Função para verificar se um campo é inválido
    const isCampoInvalido = (campo: string) => {
    const foiTocado = camposTocados[campo as keyof typeof camposTocados];
    const estaVazio = !filtros[campo as keyof typeof filtros];
    
    // Campos sempre obrigatórios
    if (campo === 'chassis' || campo === 'etapa') {
        return foiTocado && estaVazio;
    }
    
    // Campos opcionais para busca, obrigatórios para solicitação
    if (validacaoSolicitacao && (campo === 'sessao' || campo === 'motivo')) {
        return foiTocado && estaVazio;
    }
    
    return false;
};



    return (
        <Layout titulo="Solicitação de Orçamento">
            {/* Parte superior - Filtros */}
            <div className="box" style={{ marginBottom: "20px" }}>
                <h3 className="title is-5" style={{ marginBottom: "20px" }}>Filtros de Busca</h3>
                <div className="columns is-vcentered is-multiline">
                    {/* Chassis */}
                    <div className="column is-narrow">
                        <div className="field">
                            <label className="label is-small">Chassis *</label>
                            <div className="control">
                                <div className={`select is-small ${isCampoInvalido('chassis') ? 'is-danger' : ''}`}>
                                    <select
                                        value={filtros.chassis}
                                        onChange={e => handleFiltroChange('chassis', e.target.value)}
                                        className={isCampoInvalido('chassis') ? 'is-danger' : ''}
                                    >
                                        <option value="">Selecione</option>
                                        {chassisOptions.map(chassi => (
                                            <option key={chassi.id} value={chassi.numeral}>
                                                {chassi.numeral}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {isCampoInvalido('chassis') && (
                                    <p className="help is-danger">Chassis é obrigatório</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Etapa */}
                    <div className="column is-narrow">
                        <div className="field">
                            <label className="label is-small">Etapa *</label>
                            <div className="control">
                                <div className={`select is-small ${isCampoInvalido('etapa') ? 'is-danger' : ''}`}>
                                    <select
                                        value={filtros.etapa}
                                        onChange={e => handleFiltroChange('etapa', e.target.value)}
                                        className={isCampoInvalido('etapa') ? 'is-danger' : ''}
                                    >
                                        <option value="">Selecione</option>
                                        {etapaOptions.map(etapa => (
                                            <option key={etapa.id} value={etapa.etapa}>
                                                {etapa.etapa}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {isCampoInvalido('etapa') && (
                                    <p className="help is-danger">Etapa é obrigatória</p>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Sessão */}
                    <div className="column is-narrow">
                        <div className="field">
                            <label className="label is-small">Sessão {validacaoSolicitacao ? '*' : ''}</label>
                            <div className="control">
                                <div className={`select is-small ${isCampoInvalido('sessao') ? 'is-danger' : ''}`}>
                                    <select
                                        value={filtros.sessao}
                                        onChange={e => handleFiltroChange('sessao', e.target.value)}
                                        className={isCampoInvalido('sessao') ? 'is-danger' : ''}
                                    >
                                        <option value="">Selecione</option>
                                        {sessaoOptions.map(sessao => (
                                            <option key={sessao.id} value={sessao.sessao}>
                                                {sessao.sessao}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {isCampoInvalido('sessao') && (
                                    <p className="help is-danger">Sessão é obrigatória para solicitação</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Motivo */}
                    <div className="column is-narrow">
                        <div className="field">
                            <label className="label is-small">Motivo {validacaoSolicitacao ? '*' : ''}</label>
                            <div className="control">
                                <div className={`select is-small ${isCampoInvalido('motivo') ? 'is-danger' : ''}`}>
                                    <select
                                        value={filtros.motivo}
                                        onChange={e => handleFiltroChange('motivo', e.target.value)}
                                        className={isCampoInvalido('motivo') ? 'is-danger' : ''}
                                    >
                                        <option value="">Selecione</option>
                                        <option value="AVARIA">Avaria</option>
                                        <option value="MANUTENCAO">Manutenção</option>
                                    </select>
                                </div>
                                {isCampoInvalido('motivo') && (
                                    <p className="help is-danger">Motivo é obrigatório para solicitação</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Campo de componente combinado e alinhado */}
                    <div className="column is-narrow">
                        <div className="field">
                            <label className="label is-small" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                                <label className="radio is-small" style={{ marginRight: '10px', fontWeight: 'normal' }}>
                                    <input
                                        type="radio"
                                        name="tipoComponente"
                                        value="motor"
                                        checked={filtros.tipoComponente === 'motor'}
                                        onChange={() => handleFiltroChange('tipoComponente', 'motor')}
                                    />
                                    <span style={{ fontSize: '0.8rem' }}> Motor</span>
                                </label>
                                <label className="radio is-small" style={{ fontWeight: 'normal' }}>
                                    <input
                                        type="radio"
                                        name="tipoComponente"
                                        value="cambio"
                                        checked={filtros.tipoComponente === 'cambio'}
                                        onChange={() => handleFiltroChange('tipoComponente', 'cambio')}
                                    />
                                    <span style={{ fontSize: '0.8rem' }}> Câmbio</span>
                                </label>
                            </label>
                            <div className="control">
                                <div className="select is-small">
                                    <select
                                        value={filtros.componente}
                                        onChange={e => handleFiltroChange('componente', e.target.value)}
                                    >
                                        <option value="">Selecione o {filtros.tipoComponente}</option>
                                        {filtros.tipoComponente === "motor"
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

            <div className="box" style={{ marginBottom: "20px" }}>
                <h3 className="title is-5">Solicitar Nova Peça</h3>
                <TabelaOrcamentoPeca
                    onSolicitarClick={handleSolicitarPeca}
                    filtros={filtros}
                    onValidacaoFiltros={() => {
                        setCamposTocados({
                            chassis: true,
                            etapa: true,
                            sessao: true,    // Adicionado
                            motivo: true     // Adicionado
                        });
                        setValidacaoSolicitacao(true); // Importante: marca que é validação para solicitação
                    }}
                />
            </div>

            <TabelaSolicitacoes filtros={filtros} novaSolicitacao={ultimaSolicitacao} />
        </Layout>
    );
};

export default OrcamentoForm;