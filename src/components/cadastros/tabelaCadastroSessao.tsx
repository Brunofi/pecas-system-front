"use client";
import React, { useState } from "react";
import 'bulma/css/bulma.css';
import { useSessaoService } from "app/services";
import { Sessao } from "app/models/sessao";

type TabelaCadastroSessaoProps = {
    onAlterarClick: (id: number) => void;
    limparCampos: () => void;
};

export const TabelaCadastroSessao: React.FC<TabelaCadastroSessaoProps> = ({ onAlterarClick, limparCampos }) => {
    const [pesquisa, setPesquisa] = useState("");
    const [resultados, setResultados] = useState<Sessao[]>([]);
    const sessaoService = useSessaoService();
    const [pesquisaRealizada, setPesquisaRealizada] = useState(false);

    const handlePesquisa = async () => {
        try {
            const todos = await sessaoService.listarSessoes();
            if (pesquisa) {
                const filtrados = todos.filter(s =>
                    s.sessao?.toLowerCase().includes(pesquisa.toLowerCase())
                );
                setResultados(filtrados);
            } else {
                setResultados(todos);
            }
            setPesquisaRealizada(true);
            limparCampos();
        } catch (error) {
            console.error("Erro ao buscar sessões:", error);
        }
    };

    const handleRecarregar = async () => {
        try {
            const todos = await sessaoService.listarSessoes();
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
                            placeholder="Pesquisar por Nome da Sessão"
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
                        <th>Sessão</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {resultados.length > 0 ? (
                        resultados.map((sessao) => (
                            <tr key={sessao.id ?? "undefined"}>
                                <td>{sessao.id}</td>
                                <td>{sessao.sessao}</td>
                                <td>
                                    <button
                                        onClick={() => {
                                            onAlterarClick(sessao.id ?? 0);
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
                                <p>Nenhuma sessão encontrada.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
