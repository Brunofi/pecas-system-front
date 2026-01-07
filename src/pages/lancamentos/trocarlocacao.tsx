import { FormTrocarLocacao } from "components/lancamentos/FormTrocarLocacao";
import ProtectedRoute from 'components/protecaoRota/ProtectedRoute';
import { Layout } from 'components/layout';

export default function TrocarLocacaoPage() {
    return (
        <ProtectedRoute perfisPermitidos={['gerente', 'analista', 'estoquista']}>
            <Layout titulo="Trocar Peça de Locação">
                <FormTrocarLocacao />
            </Layout>
        </ProtectedRoute>
    )
}
