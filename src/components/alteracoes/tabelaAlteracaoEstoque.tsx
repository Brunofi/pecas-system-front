"use client";
import React, { useState } from "react";
import 'bulma/css/bulma.css';
import { Estoque } from "app/models/estoque";
import { useEstoqueService } from "app/services";

type TabelaAlteracaoEstoqueProps = {
    onAlterarClick: (id: number) => void;
    limparCampos: () => void;

};

export const TabelaAlteracaoEstoque: React.FC <TabelaAlteracaoEstoqueProps>= ({onAlterarClick,limparCampos}) => {
    const [pesquisa, setPesquisa] = useState("");
    const [resultados, setResultados] = useState<Estoque[]>([]);
    const service = useEstoqueService();
    const [pesquisaRealizada, setPesquisaRealizada] = useState(false);
    const [tipoPesquisa, setTipoPesquisa] = useState("partnumber");
    
    const limparTabela = () => {
        setResultados([]);
        setPesquisaRealizada(false);

    };

    const handlePesquisa = async () => {
            try {
                let estoques: Estoque[];
    
                if (tipoPesquisa === "partnumber") {
                estoques = await service.buscarEstoquesPorPartNumber(pesquisa);
            } else {
                estoques = await service.buscarEstoquesPorNome(pesquisa);
            }
    
                setResultados(estoques); // Atualiza os resultados na interface
                setPesquisaRealizada(true); // Marca que a pesquisa foi realizada
                limparCampos(); // Limpa os campos de pesquisa após a pesquisa ser realizada
            } catch (error) {
                console.error("Erro ao buscar estoques:", error);
    
            }
        };

    return (
        <div style={{ marginTop: "40px", padding: "20px", backgroundColor: "#f9f9f9" }}>
            <div style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ marginRight: "10px" }}>
            <input
              type="radio"
              name="searchOption"
              value="partnumber"
              checked={tipoPesquisa === "partnumber"}
              onChange={() => {
                setTipoPesquisa("partnumber"); // Atualiza o tipo de pesquisa
                setPesquisa(""); // Limpa o campo de pesquisa
              }}
            />
            Part Number
          </label>
          <label>
            <input
              type="radio"
              name="searchOption"
              value="nome"
              checked={tipoPesquisa === "nome"}
              onChange={() => {
                setTipoPesquisa("nome"); // Atualiza o tipo de pesquisa
                setPesquisa(""); // Limpa o campo de pesquisa
              }}
            />
            Nome
          </label>
        </div>
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
          <button
            onClick={handlePesquisa}
            className="button is-primary"
          >
            Pesquisar
          </button>
        </div>

      </div>



            <table className="table is-striped is-fullwidth">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Part number</th>
                        <th>Nome</th>
                        <th>Estado</th>
                        <th>Quantidade</th>
                        <th>Ações</th>

                    </tr>
                </thead>
                <tbody>
                    {resultados.length > 0 ? (
                        resultados.map((estoque) => (
                            <tr key={estoque.id ?? "undefined"}>
                                <td>{estoque.id}</td>
                                <td>{estoque.peca?.partnumber}</td>
                                <td>{estoque.peca?.nome}</td>
                                <td>{estoque.peca?.estado}</td>
                                <td>{estoque.quantidade}</td>

                                <td>
                                    <button
                                        onClick={() => {
                                            onAlterarClick(estoque.id ?? 0);
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
                                    <p>Nenhuma peça encontrada.</p>)}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

    );
}