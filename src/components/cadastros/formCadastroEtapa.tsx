"use client";
import { Layout } from "components/layout";
import 'bulma/css/bulma.css';
import { useState } from "react";
import { useEtapaService } from "app/services";
import { Etapa } from "app/models/etapa";
import { TabelaCadastroEtapa } from "./tabelaCadastroEtapa";
import { Mensagem } from "components/mensagem";

export const CadastroEtapa: React.FC = () => {

    const service = useEtapaService()
    const [id, setId] = useState('')
    const [etapa, setEtapa] = useState('')
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState<'is-success' | 'is-danger' | ''>('');

    //função para limpar formulario
    const limparFormulario = () => {
        setId('')
        setEtapa('')
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

    //função para cadastrar etapa
    const submit = async () => {
        const novaEtapa: Etapa = {
            etapa
        };
        try {
            const mensagem = await service.cadastrarEtapa(novaEtapa);
            mostrarMensagem(mensagem, 'is-success');
            limparFormulario();
        } catch (error: any) {
            mostrarMensagem(error.message, 'is-danger');
        }
    };

    //função para alterar etapa
    const alterar = async () => {
        const etapaEditada: Etapa = {
            id: parseInt(id),
            etapa
        };
        try {
            const mensagem = await service.atualizarEtapa(etapaEditada);
            mostrarMensagem(mensagem, 'is-success');
            limparFormulario();
        } catch (error: any) {
            mostrarMensagem(error.message, 'is-danger');
        }
    };

    //função para deletar etapa
    const remover = async (id: number) => {
        try {
            const mensagem = await service.removerEtapa(id);
            mostrarMensagem(mensagem, 'is-success');
            limparFormulario();
        } catch (error: any) {
            mostrarMensagem(error.message, 'is-danger');
        }
    };

    const buscarEtapaPorId = async (id: number) => {
        try {
            const response = await service.buscarEtapaPorId(id);
            preencherFormulario(response);
        } catch (error: any) {
            mostrarMensagem(error.message, 'is-danger');
        }
    };

    const preencherFormulario = (etapa: Etapa) => {
        setId(String(etapa.id || ""));
        setEtapa(etapa.etapa || "");
    };

    return (
        <Layout titulo="Cadastro de Etapa">
            <TabelaCadastroEtapa
                onAlterarClick={buscarEtapaPorId}
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
                        <label className="label" htmlFor="inputEtapa">Etapa: *</label>
                        <div className="control">
                            <input className="input" id="inputEtapa" value={etapa}
                                onChange={event => setEtapa(event.target.value)} type="text" placeholder="Nome da Etapa" maxLength={20} />
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
