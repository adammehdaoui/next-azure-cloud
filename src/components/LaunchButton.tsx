"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export default function LaunchButton({
  creation,
  name,
  image,
}: {
  creation: () => void;
  name: string;
  image: string;
}) {
  const [clicked, setClicked] = useState(false);

  function handleClick() {
    creation();

    toast.info("La VM est en cours de création");
    setClicked(true);
  }

  return (
    <div className="flex flex-col items-center border rounded p-3">
      <Image
        src={`/os/${image}`}
        alt="Lancer une VM"
        width={100}
        height={100}
      />
      <h2 className="text-lg mt-5">{name}</h2>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-red active:bg-blue-800 mt-4 disabled:opacity-50 disabled:cursor-wait"
        onClick={handleClick}
        disabled={clicked}
      >
        Lancer une VM
      </button>
    </div>
  );
}
