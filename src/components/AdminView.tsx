"use client";

import LaunchButton from "@/components/LaunchButton";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "sonner";

export default function AdminView({
  role,
  creation,
}: {
  role: string;
  creation: () => void;
}) {
  const error = usePathname().includes("error");

  const os = [
    {
      name: "RedHat",
      image: "redHat.svg",
    },
    {
      name: "Windows",
      image: "windows.svg",
    },
    {
      name: "Ubuntu",
      image: "ubuntu.svg",
    },
  ];

  const [loading, setLoading] = useState(false);

  function handleCreation() {
    setLoading(true);
    creation();
  }

  useEffect(() => {
    error &&
      toast.error(
        "Erreur dans la création de la machine virtuelle, veuillez réessayer. (L'ID généré est peut-être déjà utilisé)"
      );
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full md:w-2/3 lg:w-1/2 xl:w-1/3">
        <div className="flex justify-center text-xl w-full">
          Bienvenue, vous êtes connecté en tant que : {role}
        </div>
        <div className="flex justify-evenly mt-10 w-full">
          <>
            {role === "contributor" && (
              <LaunchButton
                creation={handleCreation}
                name="Ubuntu"
                image="ubuntu.svg"
                loading={loading}
              />
            )}
          </>
          <>
            {role === "admin" && (
              <div className="flex space-x-5">
                {os.map((os, index) => (
                  <LaunchButton
                    creation={handleCreation}
                    name={os.name}
                    image={os.image}
                    key={`${os.name}-${index}`}
                    loading={loading}
                  />
                ))}
              </div>
            )}
          </>
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
