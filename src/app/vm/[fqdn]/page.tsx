import StateView from "@/components/virtualMachines/StateView";
import { getAccessToken, getRole } from "@/utils/connection";
import { RedirectType, redirect } from "next/navigation";

export default async function VM() {
  const token = await getAccessToken();

  if (token === undefined) {
    return redirect("/?error=true", RedirectType.replace);
  }

  const tokenValue = JSON.parse(token).value;

  const role = await getRole(tokenValue);

  if (role === undefined) {
    return redirect("/?error=true");
  }

  return <StateView />;
}
