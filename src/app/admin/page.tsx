"use client";

import { useSession } from "@/contexts/authContext";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default function Admin() {
  const { userConnected, setUserConnected } = useSession();
  const role = userConnected?.role;

  if (userConnected === null) {
    redirect("/");
  }

  function handleCreation() {
    // launch();

    toast.success("La VM est en cours de chargement");
  }

  function handleDeconnection() {
    setUserConnected(null);

    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full md:w-2/3 lg:w-1/2 xl:w-1/3">
        <div>Salut, t&apos;es admin bravo (role : {role})</div>
        <div>
          {role === "admin" && (
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-red active:bg-blue-800 mt-4"
              onClick={handleCreation}
            >
              Lancer une VM
            </button>
          )}
          <button
            onClick={handleDeconnection}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:shadow-outline-red active:bg-red-800 mt-4 ml-4"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
