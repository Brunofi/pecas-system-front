"use client";
import { Layout } from "components/layout";
import 'bulma/css/bulma.css';
import { useState } from "react";
import { useChassisService } from "app/services";
import { Chassis } from "app/models/chassis";
import { TabelaCadastroChassis } from "./tabelaCadastroChassis";
import { Mensagem } from "components/mensagem";

export const CadastroChassis: React.FC = () => {

    const service = useChassisService()
    const [id, setId] = useState('')
    const [numeral, setNumeral] = useState('')
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState<'is-success' | 'is-danger' | ''>('');

    //função para limpar formulario
    const limparFormulario = () => {
        setId('')
        setNumeral('')
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

    //função para cadastrar chassis
    const submit = async () => {
        const chassis: Chassis = {
            numeral
        };
        try {
            const mensagem = await service.cadastrarChassis(chassis);
            mostrarMensagem(mensagem, 'is-success');
            limparFormulario();
        } catch (error: any) {
            mostrarMensagem(error.message, 'is-danger');
        }
    };

    //função para alterar chassis
    const alterar = async () => {
        const chassis: Chassis = {
            id: parseInt(id),
            numeral
        };
        try {
            const mensagem = await service.atualizarChassis(chassis);
            mostrarMensagem(mensagem, 'is-success');
            limparFormulario();
        } catch (error: any) {
            mostrarMensagem(error.message, 'is-danger');
        }
    };

    //função para deletar chassis
    const remover = async (id: number) => {
        try {
            const mensagem = await service.removerChassis(id);
            mostrarMensagem(mensagem, 'is-success');
            limparFormulario();
        } catch (error: any) {
            mostrarMensagem(error.message, 'is-danger');
        }
    };

    const buscarChassisPorId = async (id: number) => {
        try {
            const response = await service.buscarChassisPorId(id);
            preencherFormulario(response);
        } catch (error: any) {
            mostrarMensagem(error.message, 'is-danger');
        }
    };

    const preencherFormulario = (chassis: Chassis) => {
        setId(String(chassis.id || ""));
        setNumeral(chassis.numeral || "");
    };

    return (
        <Layout titulo="Cadastro de Chassis">
            <TabelaCadastroChassis
                onAlterarClick={buscarChassisPorId}
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
                        <label className="label" htmlFor="inputNumeral">Numeral do Chassis: *</label>
                        <div className="control">
                            <input className="input" id="inputNumeral" value={numeral}
                                onChange={event => setNumeral(event.target.value)} type="text" placeholder="Numeral do Chassis" maxLength={14} />
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
