import 'bulma/css/bulma.css';
import { SaidaPeca } from 'components/lancamentos';
import ProtectedRoute from 'components/protecaoRota/ProtectedRoute';


const PecaPage: React.FC = () => {
    return (
        <ProtectedRoute perfisPermitidos={['gerente', 'analista', 'estoquista']}>
            <SaidaPeca />
        </ProtectedRoute>
    )
};

export default PecaPage;