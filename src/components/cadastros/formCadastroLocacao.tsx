"use client";
import { Layout } from "components/layout";
import 'bulma/css/bulma.css';
import { useState } from "react";
import { Mensagem } from "components/mensagem";
import { Locacao } from "app/models/locacao";
import { useLocacaoService } from "app/services";
import { TabelaCadastroLocacao } from "./tabelaCadastroLocacao";

export const CadastroLocacao: React.FC = () => {

    const [id, setId] = useState('');
    const [locacao, setLocacao] = useState('');
    const [sub, setSub] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState<'is-success' | 'is-danger' | ''>('');
    const service = useLocacaoService();

    const mostrarMensagem = (mensagem: string, tipo: 'is-success' | 'is-danger') => {
        setMensagem(mensagem);
        setTipoMensagem(tipo);
        setTimeout(() => {
            setMensagem('');
            setTipoMensagem('');
        }, 5000); // Remove a mensagem após 5 segundos
    };

    const preencherFormulario = async (locacao: Locacao) => {
        setId(String(locacao.id || ""));
        setLocacao(locacao.locacao || "");
        setSub(locacao.sub || "");
    };

    const limparFormulario = () => {
        setId('');
        setLocacao('');
        setSub('');
    };

    // Função para buscar locação por ID
    const buscarLocacaoPorId = async (id: number) => {
        try {
            const response = await service.buscarLocacaoPorId(id); // Chama o método no serviço
            preencherFormulario(response); // Preenche o formulário com os dados retornados
        } catch (error: any) {
            console.error('Erro ao buscar locação:', error);
            mostrarMensagem(error.message, 'is-danger'); // Exibe mensagem de erro do back-end
        }
    };

    // Função para deletar locação
    const remover = async (id: number) => {
        try {
            const mensagem = await service.remover(id); // Aguarda o retorno da mensagem
            mostrarMensagem(mensagem, 'is-success'); // Exibe mensagem de sucesso
            limparFormulario();
        } catch (error: any) {
            console.error('Erro ao deletar a locação:', error);
            mostrarMensagem(error.message, 'is-danger'); // Exibe mensagem de erro do back-end
        }
    };

    const alterar = async () => {
        const locacaoObj: Locacao = {
            id: parseInt(id), // Certifique-se de que o ID é convertido para número
            locacao: locacao, // A propriedade `locacao` recebe o valor do estado `locacao`
            sub
        };
        try {
            const mensagem = await service.alterar(locacaoObj); // Aguarda a mensagem do back-end
            mostrarMensagem(mensagem, 'is-success'); // Exibe mensagem de sucesso
            limparFormulario();
        } catch (error: any) {
            console.error('Erro ao alterar a locação:', error);
            mostrarMensagem(error.message, 'is-danger'); // Exibe mensagem de erro do back-end
        }
    };




    const submit = async () => {
        const locacaoObj: Locacao = {
            locacao: locacao, // A propriedade `locacao` recebe o valor do estado `locacao`
            sub
        };
        try {
            const mensagem = await service.salvar(locacaoObj); // Aguarda a mensagem do back-end
            mostrarMensagem(mensagem, 'is-success'); // Exibe mensagem de sucesso
            limparFormulario();
        } catch (error: any) {
            console.error('Erro ao cadastrar a locação:', error);
            mostrarMensagem(error.message, 'is-danger'); // Exibe mensagem de erro do back-end
        }
    };


    return (
        <Layout titulo="Cadastro de locação">
            <TabelaCadastroLocacao
                onAlterarClick={buscarLocacaoPorId}
                limparCampos={limparFormulario}
            />
            <div>

                <div className="columns">
                    <div className="column is-3">
                        <div className="field">
                            <label className="label" htmlFor="inputId">ID: *</label>
                            <div className="control">
                                <input className="input" id="inputId" value={id}

                                    disabled />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="columns">
                    <div className="column">
                        <div className="field">
                            <label className="label" htmlFor="inputLocacao">Locacao: *</label>
                            <div className="control">
                                <input className="input" id="inputLocacao" value={locacao}
                                    onChange={event => setLocacao(event.target.value)} type="text" placeholder="Locacao" />
                            </div>
                        </div>
                    </div>

                    <div className="column">
                        <div className="field">
                            <label className="label" htmlFor="inputSub">Sub: *</label>
                            <div className="control">
                                <input className="input" id="inputSub" value={sub}
                                    onChange={event => setSub(event.target.value)} type="text" placeholder="Sub" />
                            </div>
                        </div>
                    </div>
                </div>



                <div className="field is-grouped">
                    {id === '' ? (
                        // Se o campo ID estiver vazio, exibe apenas o botão Cadastrar
                        <div className="control">
                            <button onClick={submit} className="button is-success is-light">Cadastrar</button>
                        </div>
                    ) : (
                        // Se o campo ID estiver preenchido, exibe os botões Alterar e Remover
                        <>
                            <div className="control">
                                <button onClick={alterar} className="button is-warning is-light">Alterar</button>
                            </div>
                            <div className="control">
                                <button onClick={() => remover(Number(id))} className="button is-danger is-light">Remover</button>
                            </div>
                        </>
                    )}
                </div>

            </div>



            <Mensagem mensagem={mensagem} tipo={tipoMensagem} />
        </Layout>

    )
}