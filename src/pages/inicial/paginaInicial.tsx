import React from 'react';
import { Layout } from 'components/layout';
import 'bulma/css/bulma.css';
import ProtectedRoute from 'components/protecaoRota/ProtectedRoute'; // Importe corretamente

const PecaPage: React.FC = () => {
    return (
        <ProtectedRoute perfisPermitidos={['gerente', 'analista', 'engenheiro', 'mecanico', 'estoquista']}>
            <Layout titulo="Página Inicial">
                <div>
                    <h1 className="title">Bem-vindo ao Sistema de Peças</h1>
                    <p className="subtitle">Gerencie suas peças de forma eficiente.</p>
                </div>
            </Layout>
        </ProtectedRoute>   
    );
};

export default PecaPage;