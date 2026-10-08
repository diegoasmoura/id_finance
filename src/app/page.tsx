import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { InvestmentWorkspace } from "@/components/investment-workspace";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/entrar");

  return <InvestmentWorkspace />;
}
