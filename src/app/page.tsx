"use client";

import { useSession } from "@/contexts/authContext";
import React, { useState } from "react";

export default function Page() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const { isConnected } = useSession();

  console.log(isConnected);

  function handleLoginChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setLogin(e.target.value);
    console.log(e.target.value);
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setPassword(e.target.value);
    console.log(e.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    console.log(login);
    console.log(password);
    console.log("submit");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full md:w-2/3 lg:w-1/2 xl:w-1/3">
        <h2 className="text-2xl font-semibold mb-6">Formulaire de connexion</h2>
        <form onSubmit={handleSubmit}>
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
              required
              onChange={(e) => {
                handleLoginChange(e);
              }}
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
              required
              onChange={(e) => {
                handlePasswordChange(e);
              }}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
