import 'bulma/css/bulma.css';
import { FormVisualizarOrcamentos } from 'components/orcamentos';
import ProtectedRoute from 'components/protecaoRota/ProtectedRoute';

const PecaPage: React.FC = () => {
    return (
        <ProtectedRoute perfisPermitidos={['gerente', 'analista', 'estoquista']}>
            <FormVisualizarOrcamentos />
        </ProtectedRoute>
    );
};

export default PecaPage;