import { Layout } from 'components/layout';
import { ProtectedRoute } from 'components';
import { FormDesfazerLancamento } from 'components/lancamentos/FormDesfazerLancamento';

const DesfazerLancamentoPeca = () => {
    return (
        <ProtectedRoute perfisPermitidos={['gerente', 'analista', 'estoquista']}>
            <Layout titulo="Desfazer Lançamento">
                <FormDesfazerLancamento />
            </Layout>
        </ProtectedRoute>
    );
};

export default DesfazerLancamentoPeca;
