"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export default function LaunchButton({
  creation,
  name,
  image,
  loading,
}: {
  creation: () => void;
  name: string;
  image: string;
  loading: boolean;
}) {
  const [clicked, setClicked] = useState(false);

  function handleClick() {
    creation();
    toast.info(
      "La VM est en cours de création, vous serez redirigé vers la page de connexion une fois qu'elle sera prête.",
      { duration: 30000 }
    );
    setClicked(true);
  }

  return (
    <div className="flex flex-col items-center border rounded-3xl p-3 w-full shadow-md">
      <Image
        src={`/os/${image}`}
        alt="Lancer une VM"
        width={100}
        height={100}
      />
      <h2 className="text-lg mt-5">{name}</h2>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:shadow-outline-red active:bg-blue-800 mt-4 disabled:opacity-50 disabled:cursor-wait"
        onClick={handleClick}
        disabled={clicked || loading}
      >
        Lancer une VM
      </button>
    </div>
  );
}
