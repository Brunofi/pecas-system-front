"use client";
import { Layout } from "components/layout";
import 'bulma/css/bulma.css';
import { useState } from "react";
import { Mensagem } from "components/mensagem";
import { useEstoqueService } from "app/services";
import { Estoque } from "app/models/estoque";
import { TabelaAlteracaoEstoque } from "./tabelaAlteracaoEstoque";

export const AlteracaoEstoque: React.FC = () => {
    const [id, setId] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState<'is-success' | 'is-danger' | ''>('');
    const service = useEstoqueService();

    const mostrarMensagem = (mensagem: string, tipo: 'is-success' | 'is-danger') => {
        setMensagem(mensagem);
        setTipoMensagem(tipo);
        setTimeout(() => {
            setMensagem('');
            setTipoMensagem('');
        }, 5000); // Remove a mensagem após 5 segundos
    };

    const preencherFormulario = async (estoque: Estoque) => {
        setId(String(estoque.id || ""));
        setQuantidade(String(estoque.quantidade || ""));

    };

    const limparFormulario = () => {
        setId('');
        setQuantidade('');
    };

    // Função para buscar estoque por ID
    const buscarEstoquePorId = async (id: number) => {
        try {
            const response = await service.buscarEstoquePorId(id);
            preencherFormulario(response); // Preenche o formulário com os dados retornados
        } catch (error: any) {
            console.error('Erro ao buscar estoque:', error);
            mostrarMensagem(error.message, 'is-danger'); // Exibe mensagem de erro do back-end
        }
    };

    // Função para atualizar a quantidade no estoque
    const atualizarQuantidade = async () => {
        if (!id || !quantidade) {
            mostrarMensagem('ID e Quantidade são obrigatórios!', 'is-danger');
            return;
        }

        try {

            const estoqueId = parseInt(id);
            const novaQuantidade = parseInt(quantidade);


            await service.alterarQuantidade(estoqueId, novaQuantidade);
            mostrarMensagem('Quantidade atualizada com sucesso!', 'is-success');
            limparFormulario(); // Limpa o formulário após a atualização
        } catch (error: any) {
            console.error('Erro ao atualizar estoque:', error);
            mostrarMensagem(error.message, 'is-danger'); // Exibe mensagem de erro do back-end
        }
    };



    return (
        <Layout titulo="Cadastro de locação">
            <TabelaAlteracaoEstoque
                onAlterarClick={buscarEstoquePorId}
                limparCampos={limparFormulario}
            />

            <div className="columns">
                <div className="column is-2">
                    <div className="field">
                        <label className="label" htmlFor="inputIdPeca">ID: *</label>
                        <div className="control">
                            <input className="input" id="inputIdPeca" value={id}

                                disabled />
                        </div>
                    </div>
                </div>

                <div className="column">
                    <div className="field">
                        <label className="label" htmlFor="inputQuantidade">Quantidade: </label>
                        <div className="control">
                            <input className="input" id="inputQuantidade" value={quantidade}
                                onChange={event => setQuantidade(event.target.value)} type="text" placeholder="Quantidade" />
                        </div>
                    </div>
                </div>

            </div>

            {/* Botão para atualizar a quantidade */}
            <div className="field">
                <div className="control">
                    <button
                        className="button is-primary"
                        onClick={atualizarQuantidade}
                        disabled={!id || !quantidade} // Desabilita o botão se id ou quantidade estiverem vazios
                    >
                        Atualizar Quantidade
                    </button>
                </div>
            </div>

            {/* Exibição de mensagens */}
            {mensagem && (
                <div className={`notification ${tipoMensagem}`}>
                    <button className="delete" onClick={() => setMensagem('')}></button>
                    {mensagem}
                </div>
            )}


        </Layout>
    );


}