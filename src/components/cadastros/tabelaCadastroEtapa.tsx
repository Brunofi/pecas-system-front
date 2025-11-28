"use client";
import React, { useState } from "react";
import 'bulma/css/bulma.css';
import { useEtapaService } from "app/services";
import { Etapa } from "app/models/etapa";

type TabelaCadastroEtapaProps = {
    onAlterarClick: (id: number) => void;
    limparCampos: () => void;
};

export const TabelaCadastroEtapa: React.FC<TabelaCadastroEtapaProps> = ({ onAlterarClick, limparCampos }) => {
    const [pesquisa, setPesquisa] = useState("");
    const [resultados, setResultados] = useState<Etapa[]>([]);
    const etapaService = useEtapaService();
    const [pesquisaRealizada, setPesquisaRealizada] = useState(false);

    const handlePesquisa = async () => {
        try {
            const todos = await etapaService.listarEtapas();
            if (pesquisa) {
                const filtrados = todos.filter(e =>
                    e.etapa?.toLowerCase().includes(pesquisa.toLowerCase())
                );
                setResultados(filtrados);
            } else {
                setResultados(todos);
            }
            setPesquisaRealizada(true);
            limparCampos();
        } catch (error) {
            console.error("Erro ao buscar etapas:", error);
        }
    };

    const handleRecarregar = async () => {
        try {
            const todos = await etapaService.listarEtapas();
            setResultados(todos);
            setPesquisa("");
            setPesquisaRealizada(false);
            limparCampos();
        } catch (error) {
            console.error("Erro ao recarregar lista:", error);
        }
    }

    return (
        <div style={{ marginTop: "40px", padding: "20px", backgroundColor: "#f9f9f9" }}>
            <div style={{ marginBottom: "20px" }}>
                <div className="field has-addons" style={{ maxWidth: "50%", }}>
                    <div className="control is-expanded">
                        <input
                            type="text"
                            className="input"
                            placeholder="Pesquisar por Nome da Etapa"
                            value={pesquisa}
                            onChange={(e) => setPesquisa(e.target.value)}
                        />
                    </div>
                    <div className="control">
                        <button
                            onClick={handlePesquisa}
                            className="button is-primary"
                        >
                            Pesquisar
                        </button>
                    </div>
                    <div className="control" style={{ marginLeft: '10px' }}>
                        <button
                            onClick={handleRecarregar}
                            className="button is-info is-light"
                        >
                            Recarregar Lista
                        </button>
                    </div>
                </div>

            </div>
            <table className="table is-striped is-fullwidth">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Etapa</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {resultados.length > 0 ? (
                        resultados.map((etapa) => (
                            <tr key={etapa.id ?? "undefined"}>
                                <td>{etapa.id}</td>
                                <td>{etapa.etapa}</td>
                                <td>
                                    <button
                                        onClick={() => {
                                            onAlterarClick(etapa.id ?? 0);
                                        }}
                                        style={{ backgroundColor: "#2196F3", color: "white", padding: "5px 10px", border: "none", cursor: "pointer" }}
                                    >
                                        Selecionar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} style={{ textAlign: "center" }}>
                                <p>Nenhuma etapa encontrada.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
