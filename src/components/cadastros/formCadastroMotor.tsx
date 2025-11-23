"use client";
import { Layout } from "components/layout";
import 'bulma/css/bulma.css';
import { useState } from "react";
import { useMotorService } from "app/services";
import { Motor } from "app/models/motor";
import { TabelaCadastroMotor } from "./tabelaCadastroMotor";
import { Mensagem } from "components/mensagem";

export const CadastroMotor: React.FC = () => {

    const service = useMotorService()
    const [id, setId] = useState('')
    const [numeroMotor, setNumeroMotor] = useState('')
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState<'is-success' | 'is-danger' | ''>('');

    //função para limpar formulario
    const limparFormulario = () => {
        setId('')
        setNumeroMotor('')
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

    //função para cadastrar motor
    const submit = async () => {
        const motor: Motor = {
            numeroMotor
        };
        try {
            const mensagem = await service.cadastrarMotor(motor);
            mostrarMensagem(mensagem, 'is-success');
            limparFormulario();
        } catch (error: any) {
            mostrarMensagem(error.message, 'is-danger');
        }
    };

    //função para alterar motor
    const alterar = async () => {
        const motor: Motor = {
            id: parseInt(id),
            numeroMotor
        };
        try {
            const mensagem = await service.atualizarMotor(motor);
            mostrarMensagem(mensagem, 'is-success');
            limparFormulario();
        } catch (error: any) {
            mostrarMensagem(error.message, 'is-danger');
        }
    };

    //função para deletar motor
    const remover = async (id: number) => {
        try {
            const mensagem = await service.removerMotor(id);
            mostrarMensagem(mensagem, 'is-success');
            limparFormulario();
        } catch (error: any) {
            mostrarMensagem(error.message, 'is-danger');
        }
    };

    const buscarMotorPorId = async (id: number) => {
        try {
            const response = await service.buscarMotorPorId(id);
            preencherFormulario(response);
        } catch (error: any) {
            mostrarMensagem(error.message, 'is-danger');
        }
    };

    const preencherFormulario = (motor: Motor) => {
        setId(String(motor.id || ""));
        setNumeroMotor(motor.numeroMotor || "");
    };

    return (
        <Layout titulo="Cadastro de Motor">
            <TabelaCadastroMotor
                onAlterarClick={buscarMotorPorId}
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
                        <label className="label" htmlFor="inputNumeroMotor">Número do Motor: *</label>
                        <div className="control">
                            <input className="input" id="inputNumeroMotor" value={numeroMotor}
                                onChange={event => setNumeroMotor(event.target.value)} type="text" placeholder="Número do Motor" maxLength={50} />
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
