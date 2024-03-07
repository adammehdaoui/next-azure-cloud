"use client";

import { deconnection } from "@/utils/connection";

function handleDeconnection() {
  deconnection();
}

export default function DeconnectionButton() {
  return (
    <button
      onClick={handleDeconnection}
      className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:shadow-outline-red active:bg-red-800 mt-4 ml-4"
    >
      Se déconnecter
    </button>
  );
}
