"use client";
import { Layout } from "components/layout";
import 'bulma/css/bulma.css';
import { useEffect, useState } from "react";
import { TabelaLancamentoPeca } from "./tabelaLancamentoPeca";
import { useChassisService } from "app/services";
import { Chassis } from "app/models/chassis";

export const SaidaPeca: React.FC = () => {
    const [tipo, setTipo] = useState("Consumo");
    const [etapa, setEtapa] = useState("25ET01");
    const [chassisSelecionado, setChassisSelecionado] = useState<string>("");
    const [chassisCedente, setChassisCedente] = useState<string>("");
    const [chassisOptions, setChassisOptions] = useState<Chassis[]>([]);

    const { listarChassis } = useChassisService();

    useEffect(() => {
        const carregarChassis = async () => {
            try {
                const chassisList = await listarChassis();
                setChassisOptions(chassisList);
            } catch (error: any) {
                console.error("Erro ao carregar chassis:", error.message);
            }
        };
        carregarChassis();
    }, []);

    const limparFormulario = () => {
        setTipo('');
        setEtapa('');
        setChassisSelecionado('');
        setChassisCedente('');
    };

    return (
        <Layout titulo="Saída de peça">
            <TabelaLancamentoPeca
                onAlterarClick={() => {}}
                limparCampos={limparFormulario}
            />

            <div className="columns">
                <div className="column">
                    <div className="field">
                        <label className="label">Tipo: *</label>
                        <div className="control">
                            <div className="select is-fullwidth">
                                <select value={tipo} onChange={event => setTipo(event.target.value)}>
                                    <option>Consumo</option>
                                    <option>Vale-Peça</option>
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
                                    <option>25ET01</option>
                                    <option>25ET02</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="column">
                    <div className="field">
                        <label className="label">Chassis cedente: *</label>
                        <div className="control">
                            <div className="select is-fullwidth">
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
        </Layout>
    );
};
