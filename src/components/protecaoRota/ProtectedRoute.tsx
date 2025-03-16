
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { verificarPermissao } from 'utils/permissao';

interface ProtectedRouteProps {
    children: React.ReactNode;
    perfisPermitidos: Array<'gerente' | 'analista' | 'engenheiro' | 'mecanico' | 'estoquista'>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, perfisPermitidos = [] }) => {
    const router = useRouter();
    const perfil = localStorage.getItem('perfil'); // perfil pode ser string ou null

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || !verificarPermissao(perfil, perfisPermitidos)) {
            router.push('/');
        }
    }, [perfil, perfisPermitidos, router]);

    return <>{children}</>;
};

export default ProtectedRoute;
