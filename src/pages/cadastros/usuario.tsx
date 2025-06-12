import 'bulma/css/bulma.css';
import { CadastroUsuario } from 'components/cadastros';
import { ProtectedRoute } from 'components/protecaoRota';


const PecaPage: React.FC = () => {
    return (
        <ProtectedRoute perfisPermitidos={['gerente']}>
            <CadastroUsuario />
        </ProtectedRoute>
    )
};

export default PecaPage;