"use client";

import VMLogin from "@/components/VMLogin";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function VMStateView() {
  const { fqdn } = useParams();

  toast.info("La machine virtuelle sera supprimée dans 10 minutes");

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 w-full">
      <div className="flex flex-col bg-white p-8 rounded-xl shadow-md w-1/2 space-y-5">
        <h1 className="text-xl">
          Informations de connexion à la machine virtuelle
        </h1>
        <VMLogin
          text={`Se connecter à la machine en SSH avec la commande : ssh notadmin@${fqdn}`}
          textToCopy={`ssh notadmin@${fqdn}`}
        />
        <VMLogin
          text={`Mot de passe pour se connecter : Pa$$w0rd92`}
          textToCopy="Pa$$w0rd92"
        />
      </div>
    </div>
  );
}
