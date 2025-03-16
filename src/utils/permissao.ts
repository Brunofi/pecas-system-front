type Perfil = 'gerente' | 'analista' | 'engenheiro' | 'mecanico' | 'estoquista';

export const verificarPermissao = (
    perfilUsuario: string | null, // Aceita string ou null
    perfilRequerido: Perfil[]
): boolean => {
    if (!perfilUsuario) {
        return false; // Se o perfil for null, retorna false
    }
    return perfilRequerido.includes(perfilUsuario as Perfil); // Faz o cast para Perfil
};