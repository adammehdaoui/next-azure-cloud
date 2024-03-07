"use client";

import { useSession } from "@/contexts/authContext";
import { redirect } from "next/navigation";

export default function Admin() {
  const { userConnected, setUserConnected } = useSession();
  const role = userConnected?.role;

  if (userConnected === null) {
    redirect("/");
  }

  function handleDeconnection() {
    setUserConnected(null);

    redirect("/");
  }

  return (
    <>
      <div>Salut, t&apos;es admin bravo (role : {role})</div>
      <button onClick={handleDeconnection}>Se déconnecter</button>
    </>
  );
}
