import 'bulma/css/bulma.css';
import { CadastroSessao } from "components/cadastros/";
import { ProtectedRoute } from 'components/protecaoRota';

const SessaoPage: React.FC = () => {
    return (
        <ProtectedRoute perfisPermitidos={['gerente', 'analista']}>
            <CadastroSessao />
        </ProtectedRoute>
    )
};

export default SessaoPage;
