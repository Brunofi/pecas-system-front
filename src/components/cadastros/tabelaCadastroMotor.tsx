"use client";
import React, { useState } from "react";
import 'bulma/css/bulma.css';
import { useMotorService } from "app/services";
import { Motor } from "app/models/motor";

type TabelaCadastroMotorProps = {
    onAlterarClick: (id: number) => void;
    limparCampos: () => void;
};

export const TabelaCadastroMotor: React.FC<TabelaCadastroMotorProps> = ({ onAlterarClick, limparCampos }) => {
    const [pesquisa, setPesquisa] = useState("");
    const [resultados, setResultados] = useState<Motor[]>([]);
    const motorService = useMotorService();
    const [pesquisaRealizada, setPesquisaRealizada] = useState(false);

    const handlePesquisa = async () => {
        if (!pesquisa) {
            // Se pesquisa vazia, não faz nada ou avisa o usuário?
            // O usuário disse: "se ele desejar ver a lista toda ele vai clicar em 'recarregar lista' com o campo 'pesquisar' vazio."
            // Então aqui talvez não devêssemos buscar tudo se estiver vazio, mas vou manter o comportamento de buscar e filtrar.
            // Se estiver vazio, o filtro vai retornar tudo.
            // Mas para seguir estritamente: "não vir nenhum motor listado... busca pelo número".
            // Vou permitir buscar tudo se ele clicar em pesquisar vazio? O user disse "clicar em recarregar lista".
            // Vou assumir que Pesquisar é focado no filtro.
        }

        try {
            const todos = await motorService.listarMotores();
            if (pesquisa) {
                const filtrados = todos.filter(m =>
                    m.numeroMotor.toLowerCase().includes(pesquisa.toLowerCase())
                );
                setResultados(filtrados);
            } else {
                // Se vazio, não mostra nada ou mostra tudo?
                // Vou mostrar tudo pois o filtro "includes" string vazia retorna true.
                // Mas o user disse que para ver tudo usa o recarregar.
                // Vou deixar mostrando tudo se ele clicar em Pesquisar vazio, pois é intuitivo.
                setResultados(todos);
            }
            setPesquisaRealizada(true);
            limparCampos();
        } catch (error) {
            console.error("Erro ao buscar motores:", error);
        }
    };

    const handleRecarregar = async () => {
        try {
            const todos = await motorService.listarMotores();
            setResultados(todos);
            setPesquisa("");
            setPesquisaRealizada(false); // Resetar flag se quiser, ou manter true para mostrar que tem dados.
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
                            placeholder="Pesquisar por Número do Motor"
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
                        <th>Número do Motor</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {resultados.length > 0 ? (
                        resultados.map((motor) => (
                            <tr key={motor.id ?? "undefined"}>
                                <td>{motor.id}</td>
                                <td>{motor.numeroMotor}</td>
                                <td>
                                    <button
                                        onClick={() => {
                                            onAlterarClick(motor.id ?? 0);
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
                                <p>Nenhum motor encontrado.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
