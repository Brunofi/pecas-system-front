"use client";
import { Layout } from "components/layout";
import 'bulma/css/bulma.css';
import { useEffect, useState } from "react";
import { TabelaLancamentoPeca } from "./tabelaLancamentoPeca";
import { useChassisService } from "app/services";
import { useEtapaService } from "app/services";
import { useSessaoService } from "app/services";
import { useUsuarioService } from "app/services";
import { Sessao } from "app/models/sessao";
import { Etapa } from "app/models/etapa";
import { Chassis } from "app/models/chassis";
import { Usuario } from "app/models/usuario";
import { Mensagem } from "components/mensagem";
import { useSaidaService } from "app/services";

export const SaidaPeca: React.FC = () => {
    const [tipo, setTipo] = useState("Consumo");
    const [etapa, setEtapa] = useState("");
    const [lado, setLado] = useState("");
    const [quantidadeSaida, setQuantidadeSaida] = useState("");
    const [chassisSelecionado, setChassisSelecionado] = useState<string>("");
    const [sessaoSelecionada, setSessaoSelecionada] = useState<string>("");
    const [chassisCedente, setChassisCedente] = useState<string>("");
    const [motivo, setMotivo] = useState<string>("");
    const [colaboradorEntrega, setColaboradorEntrega] = useState<string>("");
    const [colaboradorRetira, setColaboradorRetira] = useState<string>("");
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState<'is-success' | 'is-danger' | ''>('');
    const [idEstoque, setIdEstoque] = useState('');
    const [idPeca, setIdPeca] = useState('');
    const [idLocacao, setIdLocacao] = useState('');

    const [chassisOptions, setChassisOptions] = useState<Chassis[]>([]);
    const [etapaOptions, setEtapaOptions] = useState<Etapa[]>([]);
    const [sessaoOptions, setSessaoOptions] = useState<Sessao[]>([]);
    const [usuarioOptions, setUsuarioOptions] = useState<Usuario[]>([]);

    const chassisService = useChassisService();
    const etapaService = useEtapaService();
    const sessaoService = useSessaoService();
    const usuarioService = useUsuarioService();
    const saidaService = useSaidaService();

    const mostrarMensagem = (mensagem: string, tipo: 'is-success' | 'is-danger') => {
        setMensagem(mensagem);
        setTipoMensagem(tipo);
        setTimeout(() => {
            setMensagem('');
            setTipoMensagem('');
        }, 5000); // Remove a mensagem após 5 segundos
    };

    // Carregar chassis
    useEffect(() => {
        const carregarChassis = async () => {
            try {
                const chassisList = await chassisService.listarChassis();
                setChassisOptions(chassisList);
            } catch (error: any) {
                console.error("Erro ao carregar chassis:", error.message);
            }
        };
        carregarChassis();
    }, []);

    // Carregar etapas
    useEffect(() => {
        const carregarEtapas = async () => {
            try {
                const etapas = await etapaService.listarEtapas();
                setEtapaOptions(etapas);
            } catch (error: any) {
                console.error("Erro ao carregar etapas:", error.message);
            }
        };
        carregarEtapas();
    }, []);

    // Carregar sessões
    useEffect(() => {
        const carregarSessoes = async () => {
            try {
                const sessoes = await sessaoService.listarSessoes();
                setSessaoOptions(sessoes);
            } catch (error: any) {
                console.error("Erro ao carregar sessões:", error.message);
            }
        };
        carregarSessoes();
    }, []);

    // Carregar usuários
    useEffect(() => {
        const carregarUsuarios = async () => {
            try {
                const usuarios = await usuarioService.listarUsuarios();
                setUsuarioOptions(usuarios);
            } catch (error: any) {
                console.error("Erro ao carregar usuários:", error.message);
            }
        };
        carregarUsuarios();
    }, []);

    // Limpar formulário
    const limparFormulario = () => {
        setTipo("Consumo");
        setEtapa("");
        setLado("");
        setQuantidadeSaida("");
        setChassisSelecionado("");
        setSessaoSelecionada("");
        setChassisCedente("");
        setMotivo("");
        setColaboradorEntrega("");
        setColaboradorRetira("");
    };

    const validarCampos = () => {
        if (
            !tipo ||
            !chassisSelecionado ||
            !etapa ||
            !quantidadeSaida ||
            !sessaoSelecionada ||
            !motivo ||
            !colaboradorEntrega ||
            !colaboradorRetira
        ) {
            mostrarMensagem("Todos os campos obrigatórios devem ser preenchidos!", "is-danger");
            return false;
        }
    
        if (tipo === "Vale-Peça" && !chassisCedente) {
            mostrarMensagem("O campo 'Chassis Cedente' é obrigatório para o tipo 'Vale-Peça'.", "is-danger");
            return false;
        }
    
        return true;
    };

    const registrarSaida = async () => {
        if (!validarCampos()) {
            return; // Interrompe o processo se a validação falhar
        }
    
        const saida = {
            quantidade: parseInt(quantidadeSaida),
            tipoConsumo: tipo,
            colaboradorEntrega,
            colaboradorRetirada: colaboradorRetira,
            motivoConsumo: motivo as 'AVARIA' | 'MANUTENCAO', // Garante que o motivo seja um dos valores permitidos
            etapa,
            sessao: sessaoSelecionada,
            chassis: chassisSelecionado,
            chassisCedente: tipo === "Vale-Peça" ? chassisCedente : undefined,
            eixoLado: lado,
            peca: { id: parseInt(idPeca) }, // Converte o ID da peça para número
            locacao: { id: parseInt(idLocacao) }, // Converte o ID da locação para número
            estoque: { id: parseInt(idEstoque) }, // Converte o ID do estoque para número
        };
    
        try {
            const mensagemSucesso = await saidaService.cadastrar(saida); // Envia os dados ao backend
            mostrarMensagem(mensagemSucesso, "is-success"); // Exibe mensagem de sucesso
            limparFormulario(); // Limpa o formulário após o sucesso
        } catch (error: any) {
            console.error("Erro ao registrar saída:", error.message);
            mostrarMensagem(error.message, "is-danger"); // Exibe mensagem de erro
        }
    };

    const atualizarCamposSelecionados = (idEstoque: string, idPeca: string, idLocacao: string) => {
        setIdEstoque(idEstoque);
        setIdPeca(idPeca);
        setIdLocacao(idLocacao);
    };

    return (
        <Layout titulo="Saída de peça">
            <TabelaLancamentoPeca
                onAlterarClick={(idEstoque, idPeca, idLocacao) => {
                    atualizarCamposSelecionados(idEstoque, idPeca, idLocacao);
                }}
                limparCampos={limparFormulario}
            />
            <Mensagem mensagem={mensagem} tipo={tipoMensagem} />

            <div className="columns">
                <div className="column is-2">
                    <div className="field">
                        <label className="label" htmlFor="inputIdEstoque">IDestoque: *</label>
                        <div className="control">
                            <input className="input" id="inputIdEstoque" value={idEstoque}

                                disabled />
                        </div>
                    </div>
                </div>

                
                <div className="column is-2">
                    <div className="field">
                        <label className="label" htmlFor="inputIdPeca">IDpeça: *</label>
                        <div className="control">
                            <input className="input" id="inputIdPeca" value={idPeca}

                                disabled />
                        </div>
                    </div>
                </div>

                
                <div className="column is-2">
                    <div className="field">
                        <label className="label" htmlFor="inputIdLocacao">IDlocaçao: *</label>
                        <div className="control">
                            <input className="input" id="inputIdLocacao" value={idLocacao}

                                disabled />
                        </div>
                    </div>
                </div>

                

            </div>

            {/* Primeira linha */}
            <div className="columns">
                <div className="column">
                    <div className="field">
                        <label className="label">Tipo: *</label>
                        <div className="control">
                            <div className="select is-fullwidth">
                                <select value={tipo} onChange={event => setTipo(event.target.value)}>
                                    <option>Consumo</option>
                                    <option>Vale-Peça</option>
                                    <option>Garantia</option>
                                    <option>Imobilizado</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="column">
                    <div className="field">
                        <label className="label">Chassis: *</label>
                        <div className="control">
                            <div className="select is-fullwidth">
                                <select
                                    value={chassisSelecionado}
                                    onChange={event => setChassisSelecionado(event.target.value)}
                                >
                                    <option value="">Selecione um chassis</option>
                                    {chassisOptions.map((chassi) => (
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
                        <label className="label">Etapa: *</label>
                        <div className="control">
                            <div className="select is-fullwidth">
                                <select value={etapa} onChange={event => setEtapa(event.target.value)}>
                                    <option value="">Selecione uma etapa</option>
                                    {etapaOptions.map((etapa) => (
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
                        <label className="label">Chassis cedente: *</label>
                        <div className="control">
                            <div className="select is-fullwidth" style={{ display: tipo === "Vale-Peça" ? "block" : "none" }}>
                                <select
                                    value={chassisCedente}
                                    onChange={event => setChassisCedente(event.target.value)}
                                >
                                    <option value="">Selecione um chassis cedente</option>
                                    {chassisOptions.map((chassi) => (
                                        <option key={chassi.id} value={chassi.numeral}>
                                            {chassi.numeral}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Segunda linha */}
            <div className="columns">
                <div className="column">
                    <div className="field">
                        <label className="label">Lado: *</label>
                        <div className="control">
                            <div className="select is-fullwidth">
                                <select value={lado} onChange={event => setLado(event.target.value)}>
                                    <option value="">-</option>
                                    <option>D.E</option>
                                    <option>D.D</option>
                                    <option>T.E</option>
                                    <option>T.D</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="column">
                    <div className="field">
                        <label className="label" htmlFor="inputQuantidadeSaida">Quantidade Saída: *</label>
                        <div className="control">
                            <input
                                className="input"
                                id="inputQuantidadeSaida"
                                value={quantidadeSaida}
                                onChange={(event) => {
                                    const valor = event.target.value;
                                    // Permite apenas números
                                    if (/^\d*$/.test(valor)) {
                                        setQuantidadeSaida(valor);
                                    }
                                }}
                                type="text"
                                placeholder="Quantidade Saída"
                            />
                        </div>
                    </div>
                </div>

                <div className="column">
                    <div className="field">
                        <label className="label">Sessão: *</label>
                        <div className="control">
                            <div className="select is-fullwidth">
                                <select value={sessaoSelecionada} onChange={event => setSessaoSelecionada(event.target.value)}>
                                    <option value="">Selecione uma sessão</option>
                                    {sessaoOptions.map((sessao) => (
                                        <option key={sessao.id} value={sessao.sessao}>
                                            {sessao.sessao}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="column">
                    <div className="field">
                        <label className="label">Motivo: *</label>
                        <div className="control">
                            <div className="select is-fullwidth">
                                <select value={motivo} onChange={event => setMotivo(event.target.value)}>
                                    <option value="">Selecione um motivo</option>
                                    <option>AVARIA</option>
                                    <option>MANUTENÇÃO</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Terceira linha */}
            <div className="columns">
                <div className="column">
                    <div className="field">
                        <label className="label">Colaborador Entrega: *</label>
                        <div className="control">
                            <div className="select is-fullwidth">
                                <select value={colaboradorEntrega} onChange={event => setColaboradorEntrega(event.target.value)}>
                                    <option value="">Selecione um colaborador</option>
                                    {usuarioOptions.map((usuario) => (
                                        <option key={usuario.id} value={usuario.nome}>
                                            {usuario.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="column">
                    <div className="field">
                        <label className="label">Colaborador Retira: *</label>
                        <div className="control">
                            <div className="select is-fullwidth">
                                <select value={colaboradorRetira} onChange={event => setColaboradorRetira(event.target.value)}>
                                    <option value="">Selecione um colaborador</option>
                                    {usuarioOptions.map((usuario) => (
                                        <option key={usuario.id} value={usuario.nome}>
                                            {usuario.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Botão para registrar saída */}
            <div className="field">
                <div className="control">
                    <button className="button is-primary" onClick={registrarSaida}>
                        Registrar Saída
                    </button>
                </div>
            </div>
            
        </Layout>
    );
};