import 'bulma/css/bulma.css';
import { CadastroMotor } from "components/cadastros/";
import { ProtectedRoute } from 'components/protecaoRota';

const MotorPage: React.FC = () => {
    return (
        <ProtectedRoute perfisPermitidos={['gerente', 'analista']}>
            <CadastroMotor />
        </ProtectedRoute>
    )
};

export default MotorPage;
