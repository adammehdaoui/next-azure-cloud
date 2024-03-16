import { getAccessToken, validateToken } from "@/utils/connection";
import { redirect } from "next/navigation";

export default async function VMStateView() {
  const token = await getAccessToken();

  if (token === undefined) {
    redirect("/?error=true");
  }

  const tokenValue = JSON.parse(token).value;

  try {
    await validateToken(tokenValue);

    return <VMStateView />;
  } catch (error) {
    console.error(error);
    redirect("/?error=true");
  }
}
