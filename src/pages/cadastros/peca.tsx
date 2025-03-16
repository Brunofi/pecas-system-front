import 'bulma/css/bulma.css';
import { CadastroPeca } from "components/cadastros/";
import { ProtectedRoute } from 'components/protecaoRota';


const PecaPage: React.FC = () => {
    return (

        <ProtectedRoute perfisPermitidos={['gerente', 'analista']}>
            <CadastroPeca />
        </ProtectedRoute>
    )
};

export default PecaPage;
