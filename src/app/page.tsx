"use client";

import { useSession } from "@/contexts/authContext";
import { connection, getUserConnected } from "@/utils/connection";
import { useState } from "react";

export default function Page() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { setUserConnected } = useSession();

  async function handleConnection() {
    try {
      const formData = new FormData();
      formData.append("login", login);
      formData.append("password", password);

      await connection(formData);

      const userConnected = await getUserConnected(login);

      setUserConnected(userConnected);
    } catch (error) {
      console.error(error);
      setUserConnected(null);
      setError(true);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full md:w-2/3 lg:w-1/2 xl:w-1/3">
        <h2 className="text-2xl font-semibold mb-6">Formulaire de connexion</h2>
        <form action={handleConnection}>
          <div className="mb-4">
            <label
              htmlFor="login"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Login
            </label>
            <input
              type="text"
              id="login"
              name="login"
              className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-500 text-black"
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-500 text-black"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
          >
            Submit
          </button>
        </form>
        {error && (
          <div className="mt-4 p-3 bg-red-200 text-red-800 rounded">
            Erreur lors de la connexion
          </div>
        )}
      </div>
    </div>
  );
}
