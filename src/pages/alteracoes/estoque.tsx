import 'bulma/css/bulma.css';
import { AlteracaoEstoque } from 'components/alteracoes';
import {ProtectedRoute} from 'components/protecaoRota';


const PecaPage: React.FC = () => {
    return (
        <ProtectedRoute perfisPermitidos={['gerente']}>

        <AlteracaoEstoque />

        </ProtectedRoute>
    )
};

export default PecaPage;