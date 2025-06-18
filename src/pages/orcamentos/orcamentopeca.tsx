import 'bulma/css/bulma.css';
import { OrcamentoForm } from 'components/orcamentos';
import ProtectedRoute from 'components/protecaoRota/ProtectedRoute';

const PecaPage: React.FC = () => {
    return (
        <ProtectedRoute perfisPermitidos={['gerente', 'analista', 'estoquista', 'mecanico']}>
            <OrcamentoForm />
        </ProtectedRoute>
    )
};


export default PecaPage;