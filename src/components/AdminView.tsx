"use client";

import { Role } from "@/utils/validators/roles";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "sonner";

import LimitedUser from "@/components/virtualMachines/LimitedUser";
import PowerUser from "@/components/virtualMachines/PowerUser";

export default function AdminView({
  role,
  creation,
}: {
  role: string;
  creation: (
    publisher: string,
    offer: string,
    sku: string,
    windows: boolean
  ) => void;
}) {
  const error = useSearchParams().get("error") === "true";
  const cleanup = useSearchParams().get("cleanup") === "true";

  const [loading, setLoading] = useState(false);

  const handleCreation = useCallback(
    (publisher: string, offer: string, sku: string, windows: boolean) => {
      setLoading(true);
      creation(publisher, offer, sku, windows);
    },
    [creation]
  );

  useEffect(() => {
    if (error) {
      toast.error(
        "Erreur dans la création de la machine virtuelle, veuillez réesayer. Erreur probable : 3 machines virtuelles sont déjà en cours d'utilisation.",
        { duration: 60000 }
      );
      setLoading(false);
    }

    if (cleanup) {
      toast.success("La machine virtuelle a été supprimée avec succès", {
        duration: 60000,
      });
    }
  }, [error, cleanup]);

  return (
    <div className="flex items-center justify-center mt-56">
      <div className="bg-white p-8 rounded-lg shadow-md w-full md:w-2/3 lg:w-1/2">
        <h1 className="text-xl font-semibold text-center border-b py-5">
          Tableau de bord
        </h1>
        <p className="flex justify-center text-xl w-full mt-5">
          Bienvenue, vous êtes connecté en tant que : {role}
        </p>
        <div className="flex justify-evenly mt-10 w-full">
          {role === Role.RestrictedUser ? (
            <p className="mt-3">
              Vous n&rsquo;avez aucun crédit pour lancer une machine
              virtuelle...
            </p>
          ) : role === Role.LimitedUser ? (
            <LimitedUser handleCreation={handleCreation} loading={loading} />
          ) : (
            role === Role.PowerUser && (
              <PowerUser handleCreation={handleCreation} loading={loading} />
            )
          )}
        </div>
        <div className="mt-10 w-full flex justify-center">
          {loading && (
            <FaSpinner className="animate-spin text-blue-500" size={30} />
          )}
        </div>
      </div>
    </div>
  );
}
