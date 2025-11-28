"use client";
import { Layout } from "components/layout";
import 'bulma/css/bulma.css';
import { useState } from "react";
import { useSessaoService } from "app/services";
import { Sessao } from "app/models/sessao";
import { TabelaCadastroSessao } from "./tabelaCadastroSessao";
import { Mensagem } from "components/mensagem";

export const CadastroSessao: React.FC = () => {

    const service = useSessaoService()
    const [id, setId] = useState('')
    const [sessao, setSessao] = useState('')
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState<'is-success' | 'is-danger' | ''>('');

    //função para limpar formulario
    const limparFormulario = () => {
        setId('')
        setSessao('')
    }

    //função para mostrar mensagem
    const mostrarMensagem = (mensagem: string, tipo: 'is-success' | 'is-danger') => {
        setMensagem(mensagem);
        setTipoMensagem(tipo);
        setTimeout(() => {
            setMensagem('');
            setTipoMensagem('');
        }, 5000); // Remove a mensagem após 5 segundos
    };

    //função para cadastrar sessao
    const submit = async () => {
        const novaSessao: Sessao = {
            sessao
        };
        try {
            const mensagem = await service.cadastrarSessao(novaSessao);
            mostrarMensagem(mensagem, 'is-success');
            limparFormulario();
        } catch (error: any) {
            mostrarMensagem(error.message, 'is-danger');
        }
    };

    //função para alterar sessao
    const alterar = async () => {
        const sessaoEditada: Sessao = {
            id: parseInt(id),
            sessao
        };
        try {
            const mensagem = await service.atualizarSessao(sessaoEditada);
            mostrarMensagem(mensagem, 'is-success');
            limparFormulario();
        } catch (error: any) {
            mostrarMensagem(error.message, 'is-danger');
        }
    };

    //função para deletar sessao
    const remover = async (id: number) => {
        try {
            const mensagem = await service.removerSessao(id);
            mostrarMensagem(mensagem, 'is-success');
            limparFormulario();
        } catch (error: any) {
            mostrarMensagem(error.message, 'is-danger');
        }
    };

    const buscarSessaoPorId = async (id: number) => {
        try {
            const response = await service.buscarSessaoPorId(id);
            preencherFormulario(response);
        } catch (error: any) {
            mostrarMensagem(error.message, 'is-danger');
        }
    };

    const preencherFormulario = (sessao: Sessao) => {
        setId(String(sessao.id || ""));
        setSessao(sessao.sessao || "");
    };

    return (
        <Layout titulo="Cadastro de Sessão">
            <TabelaCadastroSessao
                onAlterarClick={buscarSessaoPorId}
                limparCampos={limparFormulario}
            />

            <div className="columns">
                <div className="column is-3">
                    <div className="field">
                        <label className="label" htmlFor="inputId">ID: *</label>
                        <div className="control">
                            <input className="input" id="inputId" value={id} disabled />
                        </div>
                    </div>
                </div>
                <div className="column">
                    <div className="field">
                        <label className="label" htmlFor="inputSessao">Sessão: *</label>
                        <div className="control">
                            <input className="input" id="inputSessao" value={sessao}
                                onChange={event => setSessao(event.target.value)} type="text" placeholder="Nome da Sessão" maxLength={20} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="field is-grouped">
                {id === '' ? (
                    <div className="control">
                        <button onClick={submit} className="button is-success is-light">Cadastrar</button>
                    </div>
                ) : (
                    <>
                        <div className="control">
                            <button onClick={alterar} className="button is-warning is-light">Alterar</button>
                        </div>
                        <div className="control">
                            <button onClick={() => remover(Number(id))} className="button is-danger is-light">Remover</button>
                        </div>
                    </>
                )}
            </div>

            <Mensagem mensagem={mensagem} tipo={tipoMensagem} />

        </Layout>
    )
}
