import Form from "@/components/Form";
import { getAccessToken, validateToken } from "@/utils/connection";
import { redirect } from "next/navigation";

export default async function Home() {
  const token = await getAccessToken();

  console.log(token);

  if (token === undefined) {
    return <Form />;
  }

  try {
    const tokenValue = JSON.parse(token).value;
    await validateToken(tokenValue);
  } catch (error) {
    console.error(error);
    return <Form />;
  }

  redirect("/dashboard");
}
