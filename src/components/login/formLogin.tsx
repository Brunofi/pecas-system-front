"use client";
import { Mensagem } from "components/mensagem";
import 'bulma/css/bulma.css';
import { useEffect, useState } from "react";
import { useUsuarioService } from "app/services";
import { useRouter } from 'next/router'; // Importe o useRouter

export const Login: React.FC = () => {
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState<'is-success' | 'is-danger' | ''>('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const usuarioService = useUsuarioService();
    const router = useRouter(); // Instancie o useRouter

    const mostrarMensagem = (mensagem: string, tipo: 'is-success' | 'is-danger') => {
        setMensagem(mensagem);
        setTipoMensagem(tipo);
        setTimeout(() => {
            setMensagem('');
            setTipoMensagem('');
        }, 5000); // Remove a mensagem após 5 segundos
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { token, perfil, nome } = await usuarioService.autenticarUsuario(email, senha);
    
            if (!perfil || !nome) {
                throw new Error("Dados do usuário incompletos");
            }
    
            // Armazena token, perfil e nome do usuário
            localStorage.setItem('token', token);
            localStorage.setItem('perfil', perfil);
            localStorage.setItem('nome', nome);
    
            router.push('/inicial/paginaInicial');
        } catch (error: any) {
            mostrarMensagem(error.message || "Usuário não cadastrado", 'is-danger');
        }
    };
    

    return (
        <div className="container is-fullheight">
            <div className="columns is-centered is-vcentered is-fullheight">
                <div className="column is-half">
                    <div className="has-text-centered mb-6">
                        <h1 className="title is-2">SISTEMA DE PEÇAS</h1>
                        <h2 className="title is-4">Login</h2>
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className="field">
                            <label className="label">Email</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="email"
                                    placeholder="Seu email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Senha</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="password"
                                    placeholder="Sua senha"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="field">
                            <div className="control">
                                <button type="submit" className="button is-primary is-fullwidth">
                                    Entrar
                                </button>
                            </div>
                        </div>
                    </form>

                    {mensagem && (
                        <div className={`notification ${tipoMensagem} mt-4`}>
                            <button className="delete" onClick={() => setMensagem('')}></button>
                            {mensagem}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};