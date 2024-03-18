import Form from "@/components/Form";
import { getAccessToken, isAlreadyConnected } from "@/utils/connection";
import { redirect } from "next/navigation";

export default async function Home() {
  const token = await getAccessToken();

  if (token === undefined) {
    return <Form />;
  }

  try {
    const tokenValue = JSON.parse(token).value;
    await isAlreadyConnected(tokenValue);
  } catch (error) {
    console.error(error);
    return <Form />;
  }

  redirect("/dashboard");
}
