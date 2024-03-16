import Form from "@/components/Form";
import { getAccessToken, validateToken } from "@/utils/connection";
import { RedirectType, redirect } from "next/navigation";

export default async function Home() {
  const token = await getAccessToken();

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

  redirect("/dashboard", RedirectType.push);
}
                                                                                                                                                                                                                                            