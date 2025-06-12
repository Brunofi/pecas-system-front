"use client";
import React, { useState } from "react";
import 'bulma/css/bulma.css';
import { Usuario } from "app/models/usuario";
import { useUsuarioService } from "app/services";

type TabelaCadastroUsuarioProps = {
    onAlterarClick: (id: number) => void;
    limparCampos: () => void;
};

export const TabelaCadastroUsuario: React.FC<TabelaCadastroUsuarioProps> = ({ 
    onAlterarClick, 
    limparCampos 
}) => {
    const [pesquisa, setPesquisa] = useState("");
    const [resultados, setResultados] = useState<Usuario[]>([]);
    const service = useUsuarioService();
    const [pesquisaRealizada, setPesquisaRealizada] = useState(false);

    const limparTabela = () => {
        setResultados([]);
        setPesquisaRealizada(false);
    };

    const handlePesquisa = async () => {
        try {
            // Busca por nome ou login do usuário
            const usuarios = await service.listarUsuarios();
            
            // Filtra os resultados localmente baseado na pesquisa
            const resultadosFiltrados = usuarios.filter(usuario => 
                usuario.nome?.toLowerCase().includes(pesquisa.toLowerCase()) ||
                usuario.login?.toLowerCase().includes(pesquisa.toLowerCase())
            );

            setResultados(resultadosFiltrados);
            setPesquisaRealizada(true);
            limparCampos();
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            setResultados([]);
        }
    };

    return (
        <div style={{ marginTop: "40px", padding: "20px", backgroundColor: "#f9f9f9" }}>
            <div style={{ marginBottom: "20px" }}>
                <div style={{ marginBottom: "10px" }}></div>
                <div className="field has-addons" style={{ maxWidth: "50%" }}>
                    <div className="control is-expanded">
                        <input
                            type="text"
                            className="input"
                            placeholder="Pesquisar por nome ou login"
                            value={pesquisa}
                            onChange={(e) => setPesquisa(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handlePesquisa()}
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
                </div>
            </div>

            <table className="table is-striped is-fullwidth">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Perfil</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {resultados.length > 0 ? (
                        resultados.map((usuario) => (
                            <tr key={usuario.id ?? "undefined"}>
                                <td>{usuario.id}</td>
                                <td>{usuario.nome}</td>
                                <td>{usuario.perfil}</td>
                                <td>
                                    <button
                                        onClick={() => {
                                            if (usuario.id) {
                                                onAlterarClick(usuario.id);
                                                limparTabela();
                                            }
                                        }}
                                        className="button is-primary is-small"
                                    >
                                        Selecionar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} style={{ textAlign: "center" }}>
                                {pesquisaRealizada && resultados.length === 0 && (
                                    <p>Nenhum usuário encontrado.</p>
                                )}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};