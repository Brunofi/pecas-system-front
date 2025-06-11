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
import { useEntradaService } from "app/services";

export const EntradaPeca: React.FC = () => {
    const [quantidadeEntrada, setQuantidadeEntrada] = useState("");
    const [motivo, setMotivo] = useState<string>("");
    const [observacao, setObservacao] = useState<string>("");
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState<'is-success' | 'is-danger' | ''>('');
    const [idEstoque, setIdEstoque] = useState('');
    const [idPeca, setIdPeca] = useState('');
    const [idLocacao, setIdLocacao] = useState('');
    const [colaborador, setColaborador] = useState<string>("");

    const [usuarioOptions, setUsuarioOptions] = useState<Usuario[]>([]);

    const usuarioService = useUsuarioService();
    const entradaService = useEntradaService();

    const mostrarMensagem = (mensagem: string, tipo: 'is-success' | 'is-danger') => {
        setMensagem(mensagem);
        setTipoMensagem(tipo);
        setTimeout(() => {
            setMensagem('');
            setTipoMensagem('');
        }, 5000);
    };

    // Carrega o nome do usuário logado
    useEffect(() => {
        const nomeUsuario = localStorage.getItem('nome');
        if (nomeUsuario) {
            setColaborador(nomeUsuario);
        }
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
        setQuantidadeEntrada("");
        setMotivo("");
        setObservacao("");
    };

    const validarCampos = () => {
        if (!quantidadeEntrada || !motivo) {
            mostrarMensagem("Todos os campos obrigatórios devem ser preenchidos!", "is-danger");
            return false;
        }
        
        if (isNaN(parseInt(quantidadeEntrada))) {
            mostrarMensagem("Quantidade deve ser um número válido!", "is-danger");
            return false;
        }
        
        return true;
    };

    const registrarEntrada = async () => {
        if (!validarCampos()) {
            return;
        }

        const entrada = {
            quantidadeEntrada: parseInt(quantidadeEntrada),
            motivo,
            colaborador,
            observacao,
            peca: { id: parseInt(idPeca) },
            locacao: { id: parseInt(idLocacao) },
        };

        try {
            const idEstoqueNum = idEstoque ? parseInt(idEstoque) : 0;
            const mensagemSucesso = await entradaService.cadastrar(entrada, idEstoqueNum);
            mostrarMensagem(mensagemSucesso, "is-success");
            limparFormulario();
        } catch (error: any) {
            console.error("Erro ao registrar entrada:", error.message);
            mostrarMensagem(error.message, "is-danger");
        }
    };

    const atualizarCamposSelecionados = (idEstoque: string, idPeca: string, idLocacao: string) => {
        setIdEstoque(idEstoque);
        setIdPeca(idPeca);
        setIdLocacao(idLocacao);
    };

    return (
        <Layout titulo="Entrada de peça">
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
                        <label className="label" htmlFor="inputIdEstoque">ID estoque:</label>
                        <div className="control">
                            <input className="input" id="inputIdEstoque" value={idEstoque} disabled />
                        </div>
                    </div>
                </div>
                
                <div className="column is-2">
                    <div className="field">
                        <label className="label" htmlFor="inputIdPeca">ID peça:</label>
                        <div className="control">
                            <input className="input" id="inputIdPeca" value={idPeca} disabled />
                        </div>
                    </div>
                </div>

                <div className="column is-2">
                    <div className="field">
                        <label className="label" htmlFor="inputIdLocacao">ID locação:</label>
                        <div className="control">
                            <input className="input" id="inputIdLocacao" value={idLocacao} disabled />
                        </div>
                    </div>
                </div>
            </div>

            <div className="columns">
                <div className="column is-3">
                    <div className="field">
                        <label className="label" htmlFor="inputQuantidadeEntrada">Quantidade Entrada: *</label>
                        <div className="control">
                            <input
                                className="input"
                                id="inputQuantidadeEntrada"
                                value={quantidadeEntrada}
                                onChange={(event) => {
                                    const valor = event.target.value;
                                    if (/^\d*$/.test(valor)) {
                                        setQuantidadeEntrada(valor);
                                    }
                                }}
                                type="text"
                                placeholder="Quantidade"
                            />
                        </div>
                    </div>
                </div>

                <div className="column is-3">
                    <div className="field">
                        <label className="label">Motivo: *</label>
                        <div className="control">
                            <div className="select is-fullwidth">
                                <select value={motivo} onChange={event => setMotivo(event.target.value)}>
                                    <option value="">Selecione um motivo</option>
                                    <option value="COMPRA">COMPRA</option>
                                    <option value="RECUPERAÇÃO DE GIRO">RECUPERAÇÃO DE GIRO</option>
                                    <option value="RECUPERAÇÃO CORRETIVA">RECUPERAÇÃO CORRETIVA</option>
                                    <option value="RETORNO AO ESTOQUE">RETORNO AO ESTOQUE</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="column is-3">
                    <div className="field">
                        <label className="label" htmlFor="inputObservacao">Observação:</label>
                        <div className="control">
                            <input
                                className="input"
                                id="inputObservacao"
                                value={observacao}
                                onChange={(event) => setObservacao(event.target.value)}
                                type="text"
                                placeholder="Observação (opcional)"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="field">
                <div className="control">
                    <button className="button is-primary" onClick={registrarEntrada}>
                        Registrar Entrada
                    </button>
                </div>
            </div>
        </Layout>
    );
};