"use client";

import { useState } from "react";
import { SignOut } from "@phosphor-icons/react";
import { authClient } from "@/lib/auth-client";

export function SessionActions() {
  const { data: session, isPending } = authClient.useSession();
  const [error, setError] = useState("");

  async function signOut() {
    setError("");
    const result = await authClient.signOut();
    if (result.error) {
      setError("Não foi possível encerrar a sessão.");
      return;
    }
    window.location.replace("/entrar");
  }

  if (isPending) return <span className="session-loading">...</span>;
  if (!session?.user) return <a className="session-link" href="/entrar">Entrar</a>;

  return (
    <div className="session-actions">
      <span className="session-name">{session.user.name || session.user.email}</span>
      <button aria-label="Sair" className="session-logout" onClick={() => void signOut()} type="button"><SignOut size={16} /></button>
      {error ? <span className="auth-message error" role="alert">{error}</span> : null}
    </div>
  );
}
