"use client";
import { Layout } from "components/layout";
import 'bulma/css/bulma.css';
import { useState } from "react";
import { Mensagem } from "components/mensagem";
import { Locacao } from "app/models/locacao";
import { useLocacaoService } from "app/services";
import { TabelaCadastroLocacao } from "./tabelaCadastroLocacao";
import { usePecaService } from "app/services";
import { Peca } from "app/models/pecas";
import { useEstoqueService } from "app/services";
import { Estoque } from "app/models/estoque";
import { TabelaCadastroPeca } from "./tabelaCadastroPeca";


export const CadastroEstoque: React.FC = () => {
    const [estoque, setEstoque] = useState<Estoque>({
        id: undefined,
        quantidade: undefined,
        peca: undefined,
        locacao: undefined,
    });

    const [idPeca, setId] = useState('')
    const [partnumber, setPartnumber] = useState('')
    const [nome, setNome] = useState('')
    const [estado, setEstado] = useState('')

    const [idLocacao, setIdLocacao] = useState('')
    const [locacao, setLocacao] = useState('')
    const [sub, setSub] = useState('')



    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState<'is-success' | 'is-danger' | ''>('');
    const service = useEstoqueService();
    const locacaoService = useLocacaoService();
    const pecaService = usePecaService();

    const mostrarMensagem = (mensagem: string, tipo: 'is-success' | 'is-danger') => {
        setMensagem(mensagem);
        setTipoMensagem(tipo);
        setTimeout(() => {
            setMensagem('');
            setTipoMensagem('');
        }, 5000); // Remove a mensagem após 5 segundos
    };

    const preencherFormularioPeca = async (peca: Peca) => {
        setId(String(peca.id || "")); // Garante valor padrão caso id seja undefined
        setPartnumber(peca.partnumber || "");
        setNome(peca.nome || "");
        setEstado(peca.estado || "");
    };

    const preencherFormularioLocacao = async (locacao: Locacao) => {
        setIdLocacao(String(locacao.id || "")); // Garante valor padrão caso id seja undefined
        setLocacao(locacao.locacao || "");
        setSub(locacao.sub || "");

    };

    const limparFormularioPeca = () => {
        setId('');
        setPartnumber('');
        setNome('');
        setEstado('');
    };

    const limparFormularioLocacao = () => {
        setIdLocacao('');
        setLocacao('');
        setSub('');
    };

    const buscarLocacaoPorId = async (id: number) => {
        limparFormularioLocacao();
        try {
            const response = await locacaoService.buscarLocacaoPorId(id); // Chama o método no serviço
            preencherFormularioLocacao(response); // Preenche o formulário com os dados retornados
        } catch (error: any) {
            console.error('Erro ao buscar locação:', error);
            mostrarMensagem(error.message, 'is-danger'); // Exibe mensagem de erro do back-end
        }
    };

    // Função para buscar peça por ID
    const buscarPecaPorId = async (id: number) => {
        limparFormularioPeca();
        try {
            const response = await pecaService.buscarPecaPorId(id);
            preencherFormularioPeca(response); // Preenche o formulário com os dados retornados
        } catch (error: any) {
            console.error("Erro ao buscar peça:", error);
            mostrarMensagem(error.message, 'is-danger'); // Exibe mensagem de erro do back-end
        }
    };

        const submit = async () => {
        
            if (!idPeca || !idLocacao) {
                mostrarMensagem('IDs de peça e locação são obrigatórios!', 'is-danger');
                return;
            }
        
            try {
                const mensagem = await service.cadastrarComIds(Number(idPeca), Number(idLocacao));
                console.log("Mensagem recebida:", mensagem); // Adicione este log para verificar a mensagem
                mostrarMensagem(mensagem, 'is-success'); // Exibe mensagem de sucesso
                limparFormularioPeca();
                limparFormularioLocacao();
            } catch (error: any) {
                console.error('Erro ao cadastrar estoque:', error);
                mostrarMensagem(error.message, 'is-danger'); // Exibe mensagem de erro do back-end
            }
        };
        


    return (
        <Layout titulo="Cadastro de estoque">

            <TabelaCadastroPeca
                onAlterarClick={buscarPecaPorId}
                limparCampos={limparFormularioPeca}


            />

            <div className="columns">
                <div className="column is-2">
                    <div className="field">
                        <label className="label" htmlFor="inputIdPeca">ID: *</label>
                        <div className="control">
                            <input className="input" id="inputIdPeca" value={idPeca}

                                disabled />
                        </div>
                    </div>
                </div>

                <div className="column">
                    <div className="field">
                        <label className="label" htmlFor="inputPartNumber">Part Number: </label>
                        <div className="control">
                            <input className="input" id="inputPartNumber" value={partnumber}
                                onChange={event => setPartnumber(event.target.value)} type="text" placeholder="Part Number" disabled />
                        </div>
                    </div>
                </div>

                <div className="column">
                    <div className="field">
                        <label className="label" htmlFor="inputNome">Nome: </label>
                        <div className="control">
                            <input className="input" id="inputNome" value={nome}
                                onChange={event => setNome(event.target.value)} type="text" placeholder="Nome" disabled />
                        </div>
                    </div>
                </div>


                <div className="column is-2">
                    <div className="field">
                        <label className="label" htmlFor="inputEstado">Estado: </label>
                        <div className="control">
                            <input className="input" id="inputEstado" value={estado}
                                onChange={event => setEstado(event.target.value)} type="text" placeholder="Estado" disabled />
                        </div>
                    </div>
                </div>


            </div>

            <TabelaCadastroLocacao
                onAlterarClick={buscarLocacaoPorId}
                limparCampos={limparFormularioLocacao}
            />

            <div className="columns">
                <div className="column is-2">
                    <div className="field">
                        <label className="label" htmlFor="inputIdLocacao">ID: </label>
                        <div className="control">
                            <input className="input" id="inputIdLocacao" value={idLocacao}

                                disabled />
                        </div>
                    </div>
                </div>

                <div className="column">
                    <div className="field">
                        <label className="label" htmlFor="inputLocacao">Locação: </label>
                        <div className="control">
                            <input className="input" id="inputLocacao" value={locacao}
                                onChange={event => setLocacao(event.target.value)} type="text" placeholder="Locação" disabled />
                        </div>
                    </div>
                </div>

                <div className="column">
                    <div className="field">
                        <label className="label" htmlFor="inputSub">Sub: </label>
                        <div className="control">
                            <input className="input" id="inputSub" value={sub}
                                onChange={event => setSub(event.target.value)} type="text" placeholder="Sub" disabled />
                        </div>
                    </div>
                </div>

            </div>

            <div className="field is-grouped">
                <div className="control">
                    <button onClick={submit} className="button is-success is-light">Cadastrar</button>
                </div>
            </div>

            <Mensagem mensagem={mensagem} tipo={tipoMensagem} />

        </Layout>
    );
};