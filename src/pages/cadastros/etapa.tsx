import 'bulma/css/bulma.css';
import { CadastroEtapa } from "components/cadastros/";
import { ProtectedRoute } from 'components/protecaoRota';

const EtapaPage: React.FC = () => {
    return (
        <ProtectedRoute perfisPermitidos={['gerente', 'analista']}>
            <CadastroEtapa />
        </ProtectedRoute>
    )
};

export default EtapaPage;
