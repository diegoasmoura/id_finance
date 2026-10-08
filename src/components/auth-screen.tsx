"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { ArrowRight, CheckCircle, LockKey, Sparkle, UserCircle } from "@phosphor-icons/react";
import { authClient } from "@/lib/auth-client";

type AuthMode = "sign-in" | "sign-up";

export function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setPending(true);

    const result = mode === "sign-in"
      ? await authClient.signIn.email({ email, password })
      : await authClient.signUp.email({ name, email, password });

    setPending(false);

    if (result.error) {
      setError(result.error.message ?? "Não foi possível concluir esta operação.");
      return;
    }

    setSuccess(mode === "sign-in" ? "Entrada realizada. Abrindo seu workspace..." : "Cadastro realizado. Abrindo seu workspace...");
    window.location.assign("/");
  }

  return (
    <main className="auth-shell">
      <section className="auth-art" aria-label="Ciclo de aprendizagem">
        <div className="auth-art-brand"><Image alt="ID Estratégia Financeira" className="auth-logo" height={62} src="/ID Estratégia Financeira Logo.png" width={230} /></div>
        <div className="auth-art-copy"><p className="eyebrow"><Sparkle size={15} weight="fill" /> Educação financeira aplicada</p><h1>Clareza para<br /><em>decidir melhor.</em></h1><p>Aprenda a ler sua renda, testar cenários e construir conhecimento antes de escolher qualquer caminho.</p></div>
        <div className="auth-orbit auth-orbit-one" /><div className="auth-orbit auth-orbit-two" /><div className="auth-art-note"><CheckCircle size={19} weight="fill" /><span>Aprendizagem por prática<br /><small>sem promessas de retorno</small></span></div>
      </section>
      <section className="auth-panel">
        <div className="auth-panel-inner">
          <div className="auth-mobile-brand"><Image alt="ID Estratégia Financeira" className="auth-logo" height={52} src="/ID Estratégia Financeira Logo.png" width={190} /></div>
          <div className="auth-heading"><span className="section-kicker">Seu espaço de estudo</span><h2>{mode === "sign-in" ? "Bem-vindo de volta." : "Comece pela clareza."}</h2><p>{mode === "sign-in" ? "Entre para continuar sua jornada." : "Crie uma conta para guardar seu progresso."}</p></div>
          <div className="auth-toggle" role="tablist" aria-label="Modo de autenticação"><button aria-selected={mode === "sign-in"} className={mode === "sign-in" ? "active" : ""} onClick={() => { setMode("sign-in"); setError(""); }} role="tab" type="button">Entrar</button><button aria-selected={mode === "sign-up"} className={mode === "sign-up" ? "active" : ""} onClick={() => { setMode("sign-up"); setError(""); }} role="tab" type="button">Criar conta</button></div>
          <form className="auth-form" onSubmit={submit}>
            {mode === "sign-up" ? <label><span>Seu nome</span><div className="auth-input"><UserCircle size={18} /><input autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} /></div></label> : null}
            <label><span>E-mail</span><div className="auth-input"><UserCircle size={18} /><input autoComplete="email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></div></label>
            <label><span>Senha</span><div className="auth-input"><LockKey size={18} /><input autoComplete={mode === "sign-in" ? "current-password" : "new-password"} minLength={8} required type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></div></label>
            {error ? <div className="auth-message error" role="alert">{error}</div> : null}
            {success ? <div className="auth-message success" role="status">{success}</div> : null}
            <button className="button-primary auth-submit" disabled={pending} type="submit">{pending ? "Aguarde..." : mode === "sign-in" ? "Entrar no workspace" : "Criar meu espaço"}<ArrowRight size={17} weight="bold" /></button>
          </form>
          <p className="auth-disclaimer">Conteúdo educacional. O acesso não constitui recomendação personalizada de investimento.</p>
        </div>
      </section>
    </main>
  );
}
