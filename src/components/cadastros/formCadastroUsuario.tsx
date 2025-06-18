"use client";
import { Layout } from "components/layout";
import 'bulma/css/bulma.css';
import { useState, useEffect } from "react";
import { Mensagem } from "components/mensagem";
import { Usuario } from "app/models/usuario";
import { useUsuarioService } from "app/services";
import { TabelaCadastroUsuario } from "./tabelaCadastroUsuario";

export const CadastroUsuario: React.FC = () => {
    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [perfil, setPerfil] = useState('');
    const [setor, setSetor] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState<'is-success' | 'is-danger' | ''>('');
    
    const service = useUsuarioService();

    const mostrarMensagem = (mensagem: string, tipo: 'is-success' | 'is-danger') => {
        setMensagem(mensagem);
        setTipoMensagem(tipo);
        setTimeout(() => {
            setMensagem('');
            setTipoMensagem('');
        }, 5000);
    };

    const preencherFormulario = async (usuario: Usuario) => {
        setId(String(usuario.id || ""));
        setNome(usuario.nome || "");
        setEmail(usuario.email || "");
        setLogin(usuario.login || "");
        setSenha(usuario.senha || ""); 
        setPerfil(usuario.perfil || "");
        setSetor(usuario.setor || "");
    };

    const limparFormulario = () => {
        setId('');
        setNome('');
        setEmail('');
        setLogin('');
        setSenha('');
        setPerfil('');
        setSetor('');
    };

    const buscarUsuarioPorId = async (id: number) => {
        try {
            const usuarios = await service.listarUsuarios();
            const usuario = usuarios.find(u => u.id === id);
            if (usuario) {
                preencherFormulario(usuario);
            } else {
                throw new Error("Usuário não encontrado");
            }
        } catch (error: any) {
            console.error('Erro ao buscar usuário:', error);
            mostrarMensagem(error.message, 'is-danger');
        }
    };

    const remover = async (id: number) => {
        try {
            const mensagem = await service.removerUsuario(id);
            mostrarMensagem(mensagem, 'is-success');
            limparFormulario();
        } catch (error: any) {
            console.error('Erro ao deletar usuário:', error);
            mostrarMensagem(error.message, 'is-danger');
        }
    };

    const alterar = async () => {
        const usuarioObj: Usuario = {
            id: parseInt(id),
            nome,
            email,
            login,
            senha: senha || undefined, // Só envia senha se foi alterada
            perfil,
            setor
        };
        
        try {
            const mensagem = await service.atualizarUsuario(usuarioObj);
            mostrarMensagem(mensagem, 'is-success');
            limparFormulario();
        } catch (error: any) {
            console.error('Erro ao alterar usuário:', error);
            mostrarMensagem(error.message, 'is-danger');
        }
    };

    const submit = async () => {
        // Validação básica
        if (!nome || !email || !login || !senha || !perfil) {
            mostrarMensagem("Preencha todos os campos obrigatórios", 'is-danger');
            return;
        }

        const usuarioObj: Usuario = {
            nome,
            email,
            login,
            senha,
            perfil,
            setor
        };

        try {
            const mensagem = await service.cadastrarUsuario(usuarioObj);
            mostrarMensagem(mensagem, 'is-success');
            limparFormulario();
        } catch (error: any) {
            console.error('Erro ao cadastrar usuário:', error);
            mostrarMensagem(error.message, 'is-danger');
        }
    };

    return (
        <Layout titulo="Cadastro de Usuário">
            <TabelaCadastroUsuario
                onAlterarClick={buscarUsuarioPorId}
                limparCampos={limparFormulario}
            />
            
            <div className="columns">
                <div className="column is-2">
                    <div className="field">
                        <label className="label" htmlFor="inputId">ID:</label>
                        <div className="control">
                            <input className="input" id="inputId" value={id} disabled />
                        </div>
                    </div>
                </div>
            </div>

            <div className="columns">
                <div className="column">
                    <div className="field">
                        <label className="label" htmlFor="inputNome">Nome *</label>
                        <div className="control">
                            <input 
                                className="input" 
                                id="inputNome" 
                                value={nome}
                                onChange={e => setNome(e.target.value)} 
                                type="text" 
                                placeholder="Nome completo" 
                            />
                        </div>
                    </div>
                </div>

                <div className="column">
                    <div className="field">
                        <label className="label" htmlFor="inputEmail">Email *</label>
                        <div className="control">
                            <input 
                                className="input" 
                                id="inputEmail" 
                                value={email}
                                onChange={e => setEmail(e.target.value)} 
                                type="email" 
                                placeholder="Email" 
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="columns">
                <div className="column">
                    <div className="field">
                        <label className="label" htmlFor="inputLogin">Login *</label>
                        <div className="control">
                            <input 
                                className="input" 
                                id="inputLogin" 
                                value={login}
                                onChange={e => setLogin(e.target.value)} 
                                type="text" 
                                placeholder="Nome de usuário" 
                            />
                        </div>
                    </div>
                </div>

                <div className="column">
                    <div className="field">
                        <label className="label" htmlFor="inputSenha">
                            {id ? "Senha" : "Senha *"}
                        </label>
                        <div className="control">
                            <input 
                                className="input" 
                                id="inputSenha" 
                                value={senha}
                                onChange={e => setSenha(e.target.value)} 
                                type="password" 
                                placeholder="Senha" 
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="columns">
                <div className="column">
                    <div className="field">
                        <label className="label">Perfil *</label>
                        <div className="control">
                            <div className="select is-fullwidth">
                                <select 
                                    value={perfil} 
                                    onChange={e => setPerfil(e.target.value)}
                                >
                                    <option value="">Selecione um perfil</option>
                                    <option value="gerente">Gerente</option>
                                    <option value="analista">Analista</option>
                                    <option value="engenheiro">Engenheiro</option>
                                    <option value="mecanico">Mecânico</option>
                                    <option value="estoquista">Estoquista</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="column">
                    <div className="field">
                        <label className="label" htmlFor="inputSetor">Setor</label>
                        <div className="control">
                            <input 
                                className="input" 
                                id="inputSetor" 
                                value={setor}
                                onChange={e => setSetor(e.target.value)} 
                                type="text" 
                                placeholder="Setor" 
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="field is-grouped">
                {id === '' ? (
                    <div className="control">
                        <button onClick={submit} className="button is-success is-light">
                            Cadastrar
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="control">
                            <button onClick={alterar} className="button is-warning is-light">
                                Alterar
                            </button>
                        </div>
                        <div className="control">
                            <button 
                                onClick={() => remover(Number(id))} 
                                className="button is-danger is-light"
                            >
                                Remover
                            </button>
                        </div>
                    </>
                )}
            </div>

            <Mensagem mensagem={mensagem} tipo={tipoMensagem} />
        </Layout>
    );
};