"use client";
import React, { useState } from "react";
import 'bulma/css/bulma.css';
import { usePecaService } from "app/services";
import { Peca } from "app/models/pecas";


type TabelaCadastroPecaProps = {
  onAlterarClick: (id: number) => void;
  limparCampos: () => void;
  
};


export const TabelaCadastroPeca: React.FC<TabelaCadastroPecaProps> = ({ onAlterarClick, limparCampos }) => {
  const [pesquisa, setPesquisa] = useState("");
  const [resultados, setResultados] = useState<Peca[]>([]);
  const pecaService = usePecaService();
  const [tipoPesquisa, setTipoPesquisa] = useState("partnumber");
  const [pesquisaRealizada, setPesquisaRealizada] = useState(false);

  const limparTabela = () => {
    setResultados([]);
    setPesquisaRealizada(false);
  };


  const handlePesquisa = async () => {
    try {
      let pecas: Peca[];

      if (tipoPesquisa === "partnumber") {
        pecas = await pecaService.buscarPecasPorPartNumber(pesquisa);
      } else {
        pecas = await pecaService.buscarPecasPorNome(pesquisa);
      }

      setResultados(pecas);
      setPesquisaRealizada(true);
      limparCampos();
    } catch (error) {
      console.error("Erro ao buscar peças:", error);
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

        <input
          type="text"
          placeholder="Pesquisar"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <button
          onClick={handlePesquisa}
          style={{ padding: "8px 12px", backgroundColor: "#4CAF50", color: "white" }}
        >
          Pesquisar
        </button>

      </div>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>ID</th>
            <th>Part Number</th>
            <th>Nome</th>
            <th>Estado</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {resultados.length > 0 ? (
            resultados.map((peca) => (
              <tr key={peca.id ?? "undefined"}>
                <td>{peca.id}</td>
                <td>{peca.partnumber}</td>
                <td>{peca.nome}</td>
                <td>{peca.estado}</td>
                <td>
                  <button
                    onClick={() => {
                      onAlterarClick(peca.id ?? 0);
                      limparTabela();}}
                    style={{ backgroundColor: "#2196F3", color: "white", padding: "5px 10px", border: "none", cursor: "pointer" }}
                  >
                    Inspecionar
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


};
