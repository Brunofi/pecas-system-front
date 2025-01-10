
import React, { ReactNode } from 'react';

import { MenuSuperior } from './menu/menuSuperior';



interface LayoutProps {
    titulo?: string;
    children?: ReactNode;
}

export const Layout: React.FC<LayoutProps> = (props: LayoutProps) => {
    return (
        <div className="app">
            {/* Adiciona o menu superior */}
            <MenuSuperior />

            <section className="main-content columns is-centered">
                <div className="container column is-10 mt-5">
                    <div className="section">
                        <div className="card">
                            <div className="card-header">
                                <p className="card-header-title">{props.titulo}</p>
                            </div>
                            <div className="card-content">
                                <div className="content">{props.children}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
