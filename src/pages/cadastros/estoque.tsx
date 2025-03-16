import 'bulma/css/bulma.css';
import { CadastroEstoque } from 'components/cadastros';
import { ProtectedRoute } from 'components/protecaoRota';


const PecaPage: React.FC = () => {
    return (
        <ProtectedRoute perfisPermitidos={['gerente', 'analista']}>
            <CadastroEstoque />
        </ProtectedRoute>
    )
};

export default PecaPage;