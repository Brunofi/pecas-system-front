import 'bulma/css/bulma.css';
import { CadastroCambio } from "components/cadastros/";
import { ProtectedRoute } from 'components/protecaoRota';

const CambioPage: React.FC = () => {
    return (
        <ProtectedRoute perfisPermitidos={['gerente', 'analista']}>
            <CadastroCambio />
        </ProtectedRoute>
    )
};

export default CambioPage;
