"use client";
import React, { useState } from "react";
import 'bulma/css/bulma.css';
import { Locacao } from "app/models/locacao";
import { useLocacaoService } from "app/services";

type TabelaCadastroLocacaoProps = {
    onAlterarClick: (id: number) => void;
    limparCampos: () => void;

};

export const TabelaCadastroLocacao: React.FC<TabelaCadastroLocacaoProps> = ({ onAlterarClick, limparCampos }) => {
    const [pesquisa, setPesquisa] = useState("");
    const [resultados, setResultados] = useState<Locacao[]>([]);
    const service = useLocacaoService();
    const [pesquisaRealizada, setPesquisaRealizada] = useState(false);

    const limparTabela = () => {
        setResultados([]);
        setPesquisaRealizada(false);

    };

    const handlePesquisa = async () => {
        try {
            let locacoes: Locacao[];

            // Busca por locação
            locacoes = await service.buscarLocacoes(pesquisa);

            setResultados(locacoes); // Atualiza os resultados na interface
            setPesquisaRealizada(true); // Marca que a pesquisa foi realizada
            limparCampos(); // Limpa os campos de pesquisa após a pesquisa ser realizada
        } catch (error) {
            console.error("Erro ao buscar locações:", error);

        }
    };



    return (
        <div style={{ marginTop: "40px", padding: "20px", backgroundColor: "#f9f9f9" }}>
            <div style={{ marginBottom: "20px" }}>
                <div style={{ marginBottom: "10px" }}></div>
                <div className="field has-addons" style={{ maxWidth: "50%", }}>
                    <div className="control is-expanded">
                        <input
                            type="text"
                            className="input"
                            placeholder="Pesquisar"
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
                </div>
            </div>



            <table className="table is-striped is-fullwidth">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Locacao</th>
                        <th>Sub</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {resultados.length > 0 ? (
                        resultados.map((locacao) => (
                            <tr key={locacao.id ?? "undefined"}>
                                <td>{locacao.id}</td>
                                <td>{locacao.locacao}</td>
                                <td>{locacao.sub}</td>

                                <td>
                                    <button
                                        onClick={() => {
                                            onAlterarClick(locacao.id ?? 0);
                                            limparTabela();
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
                            <td colSpan={5} style={{ textAlign: "center" }}>
                                {pesquisaRealizada && resultados.length === 0 && (
                                    <p>Nenhuma Locação encontrada.</p>)}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

    );

}