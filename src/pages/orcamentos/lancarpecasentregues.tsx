import 'bulma/css/bulma.css';
import { FormLancarPecasEntregues } from 'components/orcamentos';
import ProtectedRoute from 'components/protecaoRota/ProtectedRoute';

const PecaPage: React.FC = () => {
    return (
        <ProtectedRoute perfisPermitidos={['gerente', 'analista', 'estoquista', 'mecanico']}>
            <FormLancarPecasEntregues />
        </ProtectedRoute>
    )
};


export default PecaPage;