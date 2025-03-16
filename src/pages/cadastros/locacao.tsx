import 'bulma/css/bulma.css';
import { CadastroLocacao } from 'components/cadastros';
import { ProtectedRoute } from 'components/protecaoRota';


const PecaPage: React.FC = () => {
    return (
        <ProtectedRoute perfisPermitidos={['gerente', 'analista']}>
            <CadastroLocacao />
        </ProtectedRoute>
    )
};

export default PecaPage;