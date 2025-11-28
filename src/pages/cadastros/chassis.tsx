import 'bulma/css/bulma.css';
import { CadastroChassis } from "components/cadastros/";
import { ProtectedRoute } from 'components/protecaoRota';

const ChassisPage: React.FC = () => {
    return (
        <ProtectedRoute perfisPermitidos={['gerente', 'analista']}>
            <CadastroChassis />
        </ProtectedRoute>
    )
};

export default ChassisPage;
