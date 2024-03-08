"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function LaunchButton({ creation }: { creation: () => void }) {
  const [clicked, setClicked] = useState(false);

  function handleClick() {
    creation();

    toast.info("La VM est en cours de création");
    setClicked(true);
  }

  return (
    <button
      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-red active:bg-blue-800 mt-4 disabled:opacity-50 disabled:cursor-wait"
      onClick={handleClick}
      disabled={clicked}
    >
      Lancer une VM
    </button>
  );
}
