import 'bulma/css/bulma.css';
import { EntradaPeca, SaidaPeca } from 'components/lancamentos';
import ProtectedRoute from 'components/protecaoRota/ProtectedRoute';

const PecaPage: React.FC = () => {
    return (
        <ProtectedRoute perfisPermitidos={['gerente', 'analista', 'engenheiro', 'mecanico', 'estoquista']}>
            <EntradaPeca />
        </ProtectedRoute>
    )
};

export default PecaPage;