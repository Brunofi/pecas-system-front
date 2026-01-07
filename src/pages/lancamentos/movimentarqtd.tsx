import { Layout } from 'components/layout';
import { ProtectedRoute } from 'components/protecaoRota';
import { FormMovimentacaoLocacao } from 'components/lancamentos';

const MovimentacaoQtdPage: React.FC = () => {
    return (
        <ProtectedRoute perfisPermitidos={['gerente', 'analista', 'estoquista']}>
            <Layout titulo="Movimentar Quantidade entre Locações">
                <FormMovimentacaoLocacao />
            </Layout>
        </ProtectedRoute>
    );
};

export default MovimentacaoQtdPage;
