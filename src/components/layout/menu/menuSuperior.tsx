import Link from "next/link";
import { verificarPermissao } from 'utils/permissao';


export const MenuSuperior: React.FC = () => {
    const perfil = localStorage.getItem('perfil') as 'gerente' | 'analista' | 'engenheiro' | 'mecanico' | 'estoquista' | null;
    const nomeUsuario = localStorage.getItem('nome'); // Recupera o nome do usuário

    if (!perfil) {
        return null; // Ou redirecione para o login
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('perfil');
        localStorage.removeItem('nome');
        window.location.href = '/';
    };

    return (
        <nav className="navbar custom-navbar" role="navigation" aria-label="main navigation">
            {/* Navbar Brand */}
            <div className="navbar-brand">
                <Link href="/inicial/paginaInicial" className="navbar-item">
                    <img
                        src="/logo-porsche.png"
                        alt="Logo Porsche"
                        style={{ height: "60px", maxHeight: "none", marginRight: "0px" }}
                    />
                    <strong className="is-size-4">Parts System</strong>
                </Link>

                {/* Navbar Burger for mobile view */}
                <a
                    role="button"
                    className="navbar-burger"
                    aria-label="menu"
                    aria-expanded="false"
                    data-target="navbarMenu"
                >
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            {/* Navbar Menu */}
            <div id="navbarMenu" className="navbar-menu">
                <div className="navbar-start">
                    {/* Menu Cadastros */}
                    {verificarPermissao(perfil, ['gerente', 'analista']) && (
                        <div className="navbar-item has-dropdown is-hoverable">
                            <a className="navbar-link">Cadastros</a>
                            <div className="navbar-dropdown">
                                <Link href="/cadastros/peca" className="navbar-item">Peça</Link>
                                <Link href="/cadastros/locacao" className="navbar-item">Locação</Link>
                                <Link href="/cadastros/estoque" className="navbar-item">Estoque</Link>
                                {verificarPermissao(perfil, ['gerente']) && (
                                    <Link href="/cadastros/usuario" className="navbar-item">Usuario</Link>
                                )}
                            </div>
                        </div>
                    )}

                    {verificarPermissao(perfil, ['gerente' ]) && (
                    <div className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link">Alterações</a>
                        <div className="navbar-dropdown">
                            <Link href="/alteracoes/estoque" className="navbar-item">Quantidade Estoque</Link>
                        </div>
                    </div>
                    )}

                    {verificarPermissao(perfil, ['gerente','analista','estoquista' ]) && (
                    <div className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link">Lançamentos</a>
                        <div className="navbar-dropdown">
                            <Link href="/lancamentos/saidapeca" className="navbar-item">Saída de peça</Link>
                            <Link href="/lancamentos/entradapeca" className="navbar-item">Entrada de peça</Link>
                            <Link href="/lancamentos/recuperacaopeca" className="navbar-item">Recuperação de peça</Link>
                            <Link href="/lancamentos/desfazerlancamentopeca" className="navbar-item">Desfazer lançamento</Link>
                            <Link href="/lancamentos/movimentarqtd" className="navbar-item">Movimentações qtd entre locações</Link>
                            <Link href="/lancamentos/trocarlocacao" className="navbar-item">Trocar peça de locação</Link>
                        </div>
                    </div>
                    )}

                    {verificarPermissao(perfil, ['gerente','analista','estoquista','mecanico', 'engenheiro' ]) && (
                    <div className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link">Orçamentos</a>
                        <div className="navbar-dropdown">
                            <Link href="/orcamentos/orcamentopeca" className="navbar-item">Solicitar peças</Link>
                            {verificarPermissao(perfil, ['gerente','analista','estoquista', ]) && (
                            <Link href="/orcamentos/visualizarorcamentos" className="navbar-item">Visualizar orçamentos</Link>
                            )}
                            {verificarPermissao(perfil, ['gerente','analista','estoquista', ]) && (
                            <Link href="/orcamentos/lancarpecasentregues" className="navbar-item">Lançar peças entregues</Link>
                            )}
                        </div>
                    </div>
                    )}

                     {/* Menu Relatórios (apenas engenheiro) */}
                     {verificarPermissao(perfil, ['engenheiro', 'gerente']) && (
                        <div className="navbar-item has-dropdown is-hoverable">
                            <a className="navbar-link">Relatórios</a>
                            <div className="navbar-dropdown">
                                <Link href="/relatorios/saida" className="navbar-item">Saída de peças</Link>
                                <Link href="/relatorios/entrada" className="navbar-item">Entrada de peças</Link>
                            </div>
                        </div>
                    )}

                    <div className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link">Inventario</a>
                        <div className="navbar-dropdown">
                            <Link href="/Inventario/parcia" className="navbar-item">Inventario Parcia</Link>
                        </div>
                    </div>
                </div>

                {/* Botão de Logout no canto direito */}
                <div className="navbar-end">
                {nomeUsuario && (
                        <div className="navbar-item">
                            <span className="has-text-weight-semibold">Bem-vindo, {nomeUsuario}!</span>
                        </div>
                    )}
                    <div className="navbar-item">
                        <button onClick={handleLogout} className="button is-danger">
                            Sair
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};