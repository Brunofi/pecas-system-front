//tabela de busca de peças para solicitação de orçamento

"use client";
import React, { useState } from "react";
import 'bulma/css/bulma.css';
import { usePecaService } from "app/services";
import { useOrcamentoService } from "app/services";
import { Peca } from "app/models/pecas";
import { Orcamento } from "app/models/orcamento";

type TabelaOrcamentoPecaProps = {
  onSolicitarClick: (orcamento: Orcamento) => void;
  filtros: {
    chassis: string;
    etapa: string;
    sessao: string;
    motivo: string;
    tipoComponente: "motor" | "cambio";
    componente: string;
  };
  onValidacaoFiltros: (isSolicitacao?: boolean) => void; // Adicionado parâmetro
};

export const TabelaOrcamentoPeca: React.FC<TabelaOrcamentoPecaProps> = ({
  onSolicitarClick,
  filtros,
  onValidacaoFiltros // Recebendo a prop aqui
}) => {
  const [pesquisa, setPesquisa] = useState("");
  const [resultados, setResultados] = useState<Peca[]>([]);
  const [ladoSelecionado, setLadoSelecionado] = useState("-");
  const [quantidade, setQuantidade] = useState(1);
  const [pecaSelecionada, setPecaSelecionada] = useState<Peca | null>(null);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState<'is-success' | 'is-danger' | ''>('');

  const pecaService = usePecaService();
  const orcamentoService = useOrcamentoService();
  const [pesquisaRealizada, setPesquisaRealizada] = useState(false);
  const [quantidadeTocada, setQuantidadeTocada] = useState(false);

  const mostrarMensagem = (mensagem: string, tipo: 'is-success' | 'is-danger') => {
    setMensagem(mensagem);
    setTipoMensagem(tipo);
    setTimeout(() => {
      setMensagem('');
      setTipoMensagem('');
    }, 5000);
  };

  const handleQuantidadeChange = (valor: number) => {
    setQuantidade(valor);
    setQuantidadeTocada(true);
  };

  const handlePesquisa = async () => {
    try {
      //const pecas = await pecaService.buscarPecasPorPartNumber(pesquisa);
      const pecas = await pecaService.buscarPecasDistinctPorPartNumber(pesquisa);
      setResultados(pecas);
      setPesquisaRealizada(true);
    } catch (error) {
      console.error("Erro ao buscar peças:", error);
      setResultados([]);
      mostrarMensagem("Erro ao buscar peças", 'is-danger');
    }
  };

  const handleSolicitar = async () => {
    const camposFaltantesSolicitacao = [];
    if (!filtros.chassis) camposFaltantesSolicitacao.push("Chassis");
    if (!filtros.etapa) camposFaltantesSolicitacao.push("Etapa");
    if (!filtros.sessao) camposFaltantesSolicitacao.push("Sessão");
    if (!filtros.motivo) camposFaltantesSolicitacao.push("Motivo");

    if (camposFaltantesSolicitacao.length > 0) {
      onValidacaoFiltros(true); // Passe true para indicar que é validação de solicitação
      mostrarMensagem(`Para solicitar uma peça, preencha: ${camposFaltantesSolicitacao.join(', ')}`, 'is-danger');
      return;
    }


    if (!pecaSelecionada) {
      mostrarMensagem("Selecione uma peça primeiro", 'is-danger');
      return;
    }

    if (quantidade <= 0) {
      mostrarMensagem("Quantidade deve ser maior que zero", 'is-danger');
      return;
    }

    try {
      // Criar objeto orçamento
      const orcamento: Orcamento = {
        partnumber: pecaSelecionada.partnumber,
        nomePeca: pecaSelecionada.nome,
        quantidade: quantidade,
        colaboradorPedido: localStorage.getItem('nome') || 'Usuário não identificado',
        motivoConsumo: filtros.motivo as 'AVARIA' | 'MANUTENCAO',
        etapa: filtros.etapa,
        sessao: filtros.sessao,
        chassis: filtros.chassis,
        eixoLado: ladoSelecionado !== "-" ? ladoSelecionado : undefined,
        numeroMotorCambio: filtros.componente || undefined,
        //estadoPeca: pecaSelecionada.estado,
        statusPeca: "PENDENTE"
      };

      // Enviar para o backend usando o serviço
      const mensagemSucesso = await orcamentoService.cadastrar(orcamento);

      // Chamar a função do componente pai
      onSolicitarClick(orcamento);

      mostrarMensagem(mensagemSucesso, 'is-success');

      // Limpar seleção após sucesso
      setPecaSelecionada(null);
      setLadoSelecionado("-");
      setQuantidade(1);
      setPesquisa("");
      setResultados([]);

    } catch (error: any) {
      console.error("Erro ao solicitar peça:", error);
      mostrarMensagem(error.message || "Erro ao solicitar peça", 'is-danger');
    }
  };

  return (
    <div className="box">
      <h4 className="title is-6" style={{ marginBottom: "15px" }}>Buscar Peça para Solicitação</h4>
      <div className="field has-addons">
        <div className="control is-expanded">
          <input
            type="text"
            className="input is-small"
            placeholder="Pesquisar por Part Number"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handlePesquisa()}
          />
        </div>
        <div className="control">
          <button
            onClick={handlePesquisa}
            className="button is-info is-small"
          >
            Pesquisar
          </button>
        </div>
      </div>

      {/* Tabela de resultados */}
      <table className="table is-striped is-fullwidth mt-4">
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
                    className={`button is-small ${pecaSelecionada?.id === peca.id ? 'is-info' : 'is-light'}`}
                  >
                    {pecaSelecionada?.id === peca.id ? 'Selecionado' : 'Selecionar'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} style={{ textAlign: "center" }}>
                {pesquisaRealizada ? "Nenhuma peça encontrada." : "Aguardando pesquisa..."}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Campos adicionais para orçamento */}
      {pecaSelecionada && (
        <div className="box" style={{ marginTop: "20px" }}>
          <h4 className="title is-5">Solicitar Peça: {pecaSelecionada.nome}</h4>

          <div className="columns is-vcentered">
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
                <label className="label">Quantidade *</label>
                <div className="control">
                  <input
                    className={`input ${quantidadeTocada && quantidade <= 0 ? 'is-danger' : ''}`}
                    type="number"
                    min="1"
                    value={quantidade}
                    onChange={(e) => handleQuantidadeChange(Number(e.target.value))}
                  />
                  {quantidadeTocada && quantidade <= 0 && (
                    <p className="help is-danger">Quantidade deve ser maior que zero</p>
                  )}
                </div>
              </div>
            </div>

            <div className="column is-3">
              <div className="field">
                <label className="label">Informações do Pedido</label>
                <div className="content is-small">
                  <p><strong>Chassis:</strong> {filtros.chassis || 'Não informado'}</p>
                  <p><strong>Etapa:</strong> {filtros.etapa || 'Não informada'}</p>
                  <p><strong>Motivo:</strong> {filtros.motivo || 'Não informado'}</p>
                </div>
              </div>
            </div>

            <div className="column is-2">
              <div className="field" style={{ paddingTop: "1.8rem" }}>
                <button
                  onClick={handleSolicitar}
                  className="button is-success is-fullwidth"
                >
                  Solicitar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};