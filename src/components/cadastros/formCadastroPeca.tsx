"use client";
import { Layout } from "components/layout";
import 'bulma/css/bulma.css';
import { useState } from "react";
import { usePecaService } from "app/services";
import { Peca } from "app/models/pecas";
import { TabelaCadastroPeca } from "./tabelaCadastroPeca";
import { Mensagem } from "components/mensagem";


export const CadastroPeca: React.FC = () => {

    const service = usePecaService()
    const [id, setId] = useState('')
    const [partnumber, setPartnumber] = useState('')
    const [nome, setNome] = useState('')
    const [fabricante, setFabricante] = useState('')
    const [subsistema, setSubsistema] = useState('')
    const [modelocarro, setModeloCarro] = useState('')
    const [preco, setPreco] = useState('')
    const [estado, setEstado] = useState('NOVA')
    const [peso, setPeso] = useState('')
    const [ncm, setNcm] = useState('')
    const [qtdmin, setQtdMin] = useState('')
    const [qtdmed, setqtdMed] = useState('')
    const [qtdmax, setqtdMax] = useState('')
    const [partnumberSimilar, setPartnumberSimilar] = useState('')
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState<'is-success' | 'is-danger' | ''>('');

    //função para limpar formulario
    const limparFormulario = () => {
        setId('')
        setPartnumber('')
        setNome('')
        setFabricante('')
        setSubsistema('')
        setModeloCarro('')
        setPreco('')
        setEstado('NOVA')
        setPeso('')
        setNcm('')
        setQtdMin('')
        setqtdMed('')
        setqtdMax('')
        setPartnumberSimilar('')
    }

    //função para mostrar mensagem
    const mostrarMensagem = (mensagem: string, tipo: 'is-success' | 'is-danger') => {
        setMensagem(mensagem);
        setTipoMensagem(tipo);
        setTimeout(() => {
            setMensagem('');
            setTipoMensagem('');
        }, 5000); // Remove a mensagem após 5 segundos
    };

    //função para cadastrar peça
    const submit = async () => {
        const peca: Peca = {
            partnumber,
            nome,
            fabricante,
            subsistema,
            modelocarro,
            preco: parseFloat(preco.replace(",", ".")),
            estado,
            peso,
            ncm,
            qtdmin: parseFloat(qtdmin),
            qtdmed: parseFloat(qtdmed),
            qtdmax: parseFloat(qtdmax),
            partnumberSimilar
        };
        try {
            const mensagem = await service.salvar(peca); // Aguarda a mensagem do back-end
            mostrarMensagem(mensagem, 'is-success'); // Exibe mensagem de sucesso
            limparFormulario();
        } catch (error: any) {
            console.error('Erro ao cadastrar a peça:', error);
            mostrarMensagem(error.message, 'is-danger'); // Exibe mensagem de erro do back-end
        }
    };

    //função para alterar peça
    const alterar = async () => {
        const peca: Peca = {
            id: parseInt(id),
            partnumber,
            nome,
            fabricante,
            subsistema,
            modelocarro,
            preco: parseFloat(preco.replace(",", ".")),
            estado,
            peso,
            ncm,
            qtdmin: parseFloat(qtdmin),
            qtdmed: parseFloat(qtdmed),
            qtdmax: parseFloat(qtdmax),
            partnumberSimilar
        };
        try {
            const mensagem = await service.alterar(peca); // Aguarda a mensagem do back-end
            mostrarMensagem(mensagem, 'is-success'); // Exibe mensagem de sucesso
            limparFormulario();
        } catch (error: any) {
            console.error('Erro ao alterar a peça:', error);
            mostrarMensagem(error.message, 'is-danger'); // Exibe mensagem de erro do back-end
        }
    };


    //função para deletar peça
    const remover = async (id: number) => {
        try {
            const mensagem = await service.remover(id); // Aguarda o retorno da mensagem
            mostrarMensagem(mensagem, 'is-success'); // Exibe mensagem de sucesso
            limparFormulario();
        } catch (error: any) {
            console.error('Erro ao deletar a peça:', error);
            mostrarMensagem(error.message, 'is-danger'); // Exibe mensagem de erro do back-end
        }
    };


    const buscarPecaPorId = async (id: number) => {
        try {
            const response = await service.buscarPecaPorId(id);
            preencherFormulario(response); // Preenche o formulário com os dados retornados
        } catch (error: any) {
            console.error("Erro ao buscar peça:", error);
            mostrarMensagem(error.message, 'is-danger'); // Exibe mensagem de erro do back-end
        }
    };


    const preencherFormulario = (peca: Peca) => {
        setId(String(peca.id || "")); // Garante valor padrão caso id seja undefined
        setPartnumber(peca.partnumber || "");
        setNome(peca.nome || "");
        setFabricante(peca.fabricante || "");
        setSubsistema(peca.subsistema || "");
        setModeloCarro(peca.modelocarro || "");
        setPreco(String(peca.preco || 0)); // Converte número para string com valor padrão
        setEstado(peca.estado || "");
        setPeso(peca.peso || "");
        setNcm(peca.ncm || "");
        setQtdMin(String(peca.qtdmin || 0)); // Converte número para string
        setqtdMed(String(peca.qtdmed || 0));
        setqtdMax(String(peca.qtdmax || 0));
        setPartnumberSimilar(peca.partnumberSimilar || "");
    };


    return (
        <Layout titulo="Cadastro de peças">
            <TabelaCadastroPeca
                onAlterarClick={buscarPecaPorId}
                limparCampos={limparFormulario}


            />

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
                        <label className="label" htmlFor="inputPartNumber">Part Number: *</label>
                        <div className="control">
                            <input className="input" id="inputPartNumber" value={partnumber}
                                onChange={event => setPartnumber(event.target.value)} type="text" placeholder="Part Number" />
                        </div>
                    </div>
                </div>

                <div className="column">
                    <div className="field">
                        <label className="label" htmlFor="inputNome">Nome: *</label>
                        <div className="control">
                            <input className="input" id="inputNome" value={nome}
                                onChange={event => setNome(event.target.value)} type="text" placeholder="Nome" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="columns">
                <div className="column">
                    <div className="field">
                        <label className="label" htmlFor="inputFabricante">Fabricante: *</label>
                        <div className="control">
                            <input className="input" id="inputFabricante" value={fabricante}
                                onChange={event => setFabricante(event.target.value)} type="text" placeholder="Fabricante" />
                        </div>
                    </div>
                </div>

                <div className="column">
                    <div className="field">
                        <label className="label" htmlFor="inputSubsistema">Subsistema: *</label>
                        <div className="control">
                            <input className="input" id="inputSubsistema" value={subsistema}
                                onChange={event => setSubsistema(event.target.value)} type="text" placeholder="Subsistema" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="columns">
                <div className="column">
                    <div className="field">
                        <label className="label" htmlFor="inputModelo">Modelo: *</label>
                        <div className="control">
                            <input className="input" id="inputModelo" value={modelocarro}
                                onChange={event => setModeloCarro(event.target.value)} type="text" placeholder="Modelo" />
                        </div>
                    </div>
                </div>

                <div className="column">
                    <div className="field">
                        <label className="label" htmlFor="inputPreco">Preço: *</label>
                        <div className="control">
                            <input className="input" id="inputPreco" value={preco}
                                onChange={event => setPreco(event.target.value)} type="number" placeholder="Preço" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="columns">
                <div className="column">
                    <div className="field">
                        <label className="label">Estado: *</label>
                        <div className="control">
                            <div className="select is-fullwidth">
                                <select value={estado}
                                    onChange={event => setEstado(event.target.value)}>
                                    <option>NOVA</option>
                                    <option>REC</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="column">
                    <div className="field">
                        <label className="label" htmlFor="inputPeso">Peso: *</label>
                        <div className="control">
                            <input className="input" id="inputPeso" value={peso}
                                onChange={event => setPeso(event.target.value)} type="number" placeholder="Peso" />
                        </div>
                    </div>
                </div>
                <div className="column">
                    <div className="field">
                        <label className="label" htmlFor="inputNCM">NCM: *</label>
                        <div className="control">
                            <input className="input" id="inputNCM" value={ncm}
                                onChange={event => setNcm(event.target.value)} type="number" placeholder="NCM" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="columns">
                <div className="column">
                    <div className="field">
                        <label className="label" htmlFor="inputQtdMin">Qtd Min: *</label>
                        <div className="control">
                            <input className="input" id="inputQtdMin" value={qtdmin}
                                onChange={event => setQtdMin(event.target.value)} type="number" placeholder="Qtd Min" />
                        </div>
                    </div>
                </div>
                <div className="column">
                    <div className="field">
                        <label className="label" htmlFor="inputQtdMed">Qtd Med: *</label>
                        <div className="control">
                            <input className="input" id="inputQtdMed" value={qtdmed}
                                onChange={event => setqtdMed(event.target.value)} type="number" placeholder="Qtd Med" />
                        </div>
                    </div>
                </div>
                <div className="column">
                    <div className="field">
                        <label className="label" htmlFor="inputQtdMax">Qtd Max: *</label>
                        <div className="control">
                            <input className="input" id="inputQtdMax" value={qtdmax}
                                onChange={event => setqtdMax(event.target.value)} type="number" placeholder="Qtd Max" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="columns">
                <div className="column is-6">
                    <div className="field">
                        <label className="label" htmlFor="inputPartNumberSimilar">Part Number Similar: </label>
                        <div className="control">
                            <input className="input" id="inputPartNumberSimilar" value={partnumberSimilar}
                                onChange={event => setPartnumberSimilar(event.target.value)} type="text" placeholder="Part Number Similar" />
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


            <Mensagem mensagem={mensagem} tipo={tipoMensagem} />



        </Layout>
    )
}