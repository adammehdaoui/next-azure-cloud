import DeconnectionButton from "@/components/DeconnectionButton";
import LaunchButton from "@/components/LaunchButton";
import { getAccessToken, validateToken } from "@/utils/connection";
import { redirect } from "next/navigation";

export default async function Admin() {
  const token = await getAccessToken();

  if (token === undefined) {
    redirect("/");
  }

  const tokenValue = JSON.parse(token).value;

  try {
    const decodedToken = await validateToken(tokenValue);

    const role = decodedToken.role;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full md:w-2/3 lg:w-1/2 xl:w-1/3">
          <div>Salut, t&apos;es admin bravo (role : {role})</div>
          <div>
            {role === "admin" && <LaunchButton />}
            <DeconnectionButton />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
    redirect("/");
  }
}
