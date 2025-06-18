"use client";
import React, { useState } from "react";
import 'bulma/css/bulma.css';
import { usePecaService } from "app/services";
import { Peca } from "app/models/pecas";

type TabelaOrcamentoPecaProps = {
  onSolicitarClick: (peca: Peca, lado: string, quantidade: number) => void;
};

export const TabelaOrcamentoPeca: React.FC<TabelaOrcamentoPecaProps> = ({ onSolicitarClick }) => {
  const [pesquisa, setPesquisa] = useState("");
  const [resultados, setResultados] = useState<Peca[]>([]);
  const [ladoSelecionado, setLadoSelecionado] = useState("-");
  const [quantidade, setQuantidade] = useState(1);
  const [pecaSelecionada, setPecaSelecionada] = useState<Peca | null>(null);
  const pecaService = usePecaService();
  const [pesquisaRealizada, setPesquisaRealizada] = useState(false);

  const handlePesquisa = async () => {
    try {
      const pecas = await pecaService.buscarPecasPorPartNumber(pesquisa);
      setResultados(pecas);
      setPesquisaRealizada(true);
    } catch (error) {
      console.error("Erro ao buscar peças:", error);
      setResultados([]);
    }
  };

  const handleSolicitar = () => {
    if (!pecaSelecionada) {
      alert("Selecione uma peça primeiro");
      return;
    }
    
    if (quantidade <= 0) {
      alert("Quantidade deve ser maior que zero");
      return;
    }

    onSolicitarClick(pecaSelecionada, ladoSelecionado, quantidade);
    
    // Limpa seleção após solicitar
    setPecaSelecionada(null);
    setLadoSelecionado("-");
    setQuantidade(1);
  };

  return (
    <div style={{ marginTop: "20px", padding: "20px", backgroundColor: "#f9f9f9" }}>
      <div style={{ marginBottom: "20px" }}>
        <div className="field has-addons" style={{ maxWidth: "50%" }}>
          <div className="control is-expanded">
            <input
              type="text"
              className="input"
              placeholder="Pesquisar por Part Number"
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

      {/* Tabela de resultados */}
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>Part Number</th>
            <th>Nome da Peça</th>
            <th>Selecionar</th>
          </tr>
        </thead>
        <tbody>
          {resultados.length > 0 ? (
            resultados.map((peca) => (
              <tr 
                key={peca.id ?? "undefined"} 
                style={{ backgroundColor: pecaSelecionada?.id === peca.id ? '#e6f7ff' : 'inherit' }}
              >
                <td>{peca.partnumber}</td>
                <td>{peca.nome}</td>
                <td>
                  <button
                    onClick={() => setPecaSelecionada(peca)}
                    className={`button is-small ${pecaSelecionada?.id === peca.id ? 'is-info' : ''}`}
                  >
                    {pecaSelecionada?.id === peca.id ? 'Selecionado' : 'Selecionar'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} style={{ textAlign: "center" }}>
                {pesquisaRealizada && resultados.length === 0 && (
                  <p>Nenhuma peça encontrada.</p>
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Campos adicionais para orçamento */}
      {pecaSelecionada && (
        <div className="columns" style={{ marginTop: "20px" }}>
          <div className="column is-2">
            <div className="field">
              <label className="label">Lado</label>
              <div className="control">
                <div className="select">
                  <select 
                    value={ladoSelecionado} 
                    onChange={(e) => setLadoSelecionado(e.target.value)}
                  >
                    <option value="-">-</option>
                    <option value="D.E">D.E</option>
                    <option value="D.D">D.D</option>
                    <option value="T.E">T.E</option>
                    <option value="T.D">T.D</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="column is-2">
            <div className="field">
              <label className="label">Quantidade</label>
              <div className="control">
                <input
                  className="input"
                  type="number"
                  min="1"
                  value={quantidade}
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="column is-2">
            <div className="field" style={{ paddingTop: "1.8rem" }}>
              <button
                onClick={handleSolicitar}
                className="button is-success"
              >
                Solicitar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};