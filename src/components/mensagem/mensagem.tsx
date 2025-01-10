import React from "react";

interface MensagemProps {
  mensagem: string;
  tipo: 'is-success' | 'is-danger' | '';
}

export const Mensagem: React.FC<MensagemProps> = ({ mensagem, tipo }) => {
  if (!mensagem) return null; // Não renderiza nada se não houver mensagem

  return (
    <article className={`message ${tipo}`}>
      <div className="message-header">
        <p>{tipo === 'is-success' ? 'Sucesso' : 'Erro'}</p>
      </div>
      <div className="message-body">{mensagem}</div>
    </article>
  );
};
