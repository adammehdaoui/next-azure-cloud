import AdminView from "@/components/AdminView";
import { getAccessToken, getRole } from "@/utils/connection";
import { handleCreation } from "@/utils/vm-actions";
import { RedirectType, redirect } from "next/navigation";

export default async function Dashboard() {
  const token = await getAccessToken();

  if (token === undefined) {
    return redirect("/?error=true", RedirectType.replace);
  }

  const tokenValue = JSON.parse(token).value;

  const role = await getRole(tokenValue);

  if (role === undefined) {
    return redirect("/?error=true");
  }

  return <AdminView role={role} creation={handleCreation} />;
}
