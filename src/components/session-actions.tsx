"use client";

import { SignOut } from "@phosphor-icons/react";
import { authClient } from "@/lib/auth-client";

export function SessionActions() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return <span className="session-loading">...</span>;
  if (!session?.user) return <a className="session-link" href="/entrar">Entrar</a>;

  return <div className="session-actions"><span className="session-name">{session.user.name || session.user.email}</span><button aria-label="Sair" className="session-logout" onClick={() => authClient.signOut({ fetchOptions: { onSuccess: () => window.location.assign("/entrar") } })} type="button"><SignOut size={16} /></button></div>;
}
