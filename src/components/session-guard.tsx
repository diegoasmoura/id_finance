"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export function SessionGuard() {
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      void authClient.getSession().then(({ data }) => {
        if (!data?.user) window.location.replace("/entrar");
      });
    };

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return null;
}
