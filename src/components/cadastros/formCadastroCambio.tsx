"use client";
import { Layout } from "components/layout";
import 'bulma/css/bulma.css';
import { useState } from "react";
import { useCambioService } from "app/services";
import { Cambio } from "app/models/cambio";
import { TabelaCadastroCambio } from "./tabelaCadastroCambio";
import { Mensagem } from "components/mensagem";

export const CadastroCambio: React.FC = () => {

    const service = useCambioService()
    const [id, setId] = useState('')
    const [numeroCambio, setNumeroCambio] = useState('')
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState<'is-success' | 'is-danger' | ''>('');

    //função para limpar formulario
    const limparFormulario = () => {
        setId('')
        setNumeroCambio('')
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

    //função para cadastrar cambio
    const submit = async () => {
        const cambio: Cambio = {
            numeroCambio
        };
        try {
            const mensagem = await service.cadastrarCambio(cambio);
            mostrarMensagem(mensagem, 'is-success');
            limparFormulario();
        } catch (error: any) {
            mostrarMensagem(error.message, 'is-danger');
        }
    };

    //função para alterar cambio
    const alterar = async () => {
        const cambio: Cambio = {
            id: parseInt(id),
            numeroCambio
        };
        try {
            const mensagem = await service.atualizarCambio(cambio);
            mostrarMensagem(mensagem, 'is-success');
            limparFormulario();
        } catch (error: any) {
            mostrarMensagem(error.message, 'is-danger');
        }
    };

    //função para deletar cambio
    const remover = async (id: number) => {
        try {
            const mensagem = await service.removerCambio(id);
            mostrarMensagem(mensagem, 'is-success');
            limparFormulario();
        } catch (error: any) {
            mostrarMensagem(error.message, 'is-danger');
        }
    };

    const buscarCambioPorId = async (id: number) => {
        try {
            const response = await service.buscarCambioPorId(id);
            preencherFormulario(response);
        } catch (error: any) {
            mostrarMensagem(error.message, 'is-danger');
        }
    };

    const preencherFormulario = (cambio: Cambio) => {
        setId(String(cambio.id || ""));
        setNumeroCambio(cambio.numeroCambio || "");
    };

    return (
        <Layout titulo="Cadastro de Câmbio">
            <TabelaCadastroCambio
                onAlterarClick={buscarCambioPorId}
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
                        <label className="label" htmlFor="inputNumeroCambio">Número do Câmbio: *</label>
                        <div className="control">
                            <input className="input" id="inputNumeroCambio" value={numeroCambio}
                                onChange={event => setNumeroCambio(event.target.value)} type="text" placeholder="Número do Câmbio" maxLength={50} />
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
