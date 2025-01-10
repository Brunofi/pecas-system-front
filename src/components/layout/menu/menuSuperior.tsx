import Link from "next/link";

export const MenuSuperior: React.FC = () => {
    return (
        <nav className="navbar custom-navbar" role="navigation" aria-label="main navigation">
            {/* Navbar Brand */}
            <div className="navbar-brand">
                <Link href="/" className="navbar-item">
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
                    <div className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link">Cadastros</a>
                        <div className="navbar-dropdown">
                            <Link href="/cadastros/peca" className="navbar-item">Peça</Link>
                            <Link href="/cadastros/locacao" className="navbar-item">Locação</Link>
                            <Link href="/cadastros/estoque" className="navbar-item">Estoque</Link>
                            <Link href="/cadastros/usuario" className="navbar-item">Usuario</Link>
                            <Link href="/cadastros/colaborador" className="navbar-item">Colaborador</Link>
                        </div>
                    </div>

                    <div className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link">Alterações</a>
                        <div className="navbar-dropdown">
                            <Link href="alteracoes/qtdestoque" className="navbar-item">Quantidade Estoque</Link>
                        </div>
                    </div>

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

                    <div className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link">Orçamentos</a>
                        <div className="navbar-dropdown">
                            <Link href="/orcamentos/solicitarpeca" className="navbar-item">Solicitar peças</Link>
                            <Link href="/orcamentos/visualizarorcamentos" className="navbar-item">Visualizar orçamentos</Link>
                            <Link href="/orcamentos/lancarpecasentregues" className="navbar-item">Lançar peças entregues</Link>
                        </div>
                    </div>

                    <div className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link">Relatórios</a>
                        <div className="navbar-dropdown">
                            <Link href="/relatórios/saida" className="navbar-item">Saída de peças</Link>
                            <Link href="/relatórios/entrada" className="navbar-item">Entrada de peças</Link>
                        </div>
                    </div>

                    <div className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link">Inventario</a>
                        <div className="navbar-dropdown">
                            <Link href="/Inventario/parcia" className="navbar-item">Inventario Parcia</Link></div>
                    </div>

                </div>
            </div>
        </nav>
    );
};
