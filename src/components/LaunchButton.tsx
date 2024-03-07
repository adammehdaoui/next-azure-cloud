"use client";

import { toast } from "sonner";

export default function LaunchButton() {
  function handleCreation() {
    // launch();

    toast.success("La VM est en cours de chargement");
  }

  return (
    <button
      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-red active:bg-blue-800 mt-4"
      onClick={handleCreation}
    >
      Lancer une VM
    </button>
  );
}
