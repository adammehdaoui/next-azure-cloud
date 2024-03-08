import AdminView from "@/components/AdminView";
import { getAccessToken, validateToken } from "@/utils/connection";
import { launch } from "@/utils/create-vm";
import { redirect } from "next/navigation";

export default async function Admin() {
  async function handleCreation() {
    "use server";
    const fqdn = await launch();

    redirect(`/vm/${fqdn}`);
  }

  const token = await getAccessToken();

  if (token === undefined) {
    redirect("/");
  }

  const tokenValue = JSON.parse(token).value;

  try {
    const decodedToken = await validateToken(tokenValue);

    const role = decodedToken.role;

    return <AdminView role={role} creation={handleCreation} />;
  } catch (error) {
    console.error(error);
    redirect("/");
  }
}
