"use server";

import { users } from "@/config/users";
import type { User } from "@/contexts/authContext";
import { redirect } from "next/navigation";

export async function connection(formData: FormData) {
  const userFound = users.find(
    (user) =>
      user.name === formData.get("login") &&
      user.password === formData.get("password")
  );

  if (userFound) {
    redirect("/admin");
  }

  throw new Error("User not found");
}

export async function getUserConnected(login: string): Promise<User> {
  const userFound = users.find((user) => user.name === login);

  if (!userFound) {
    throw new Error("User not found");
  }

  return { login: userFound.name, role: userFound.role };
}
