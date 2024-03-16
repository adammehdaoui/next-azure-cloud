"use server";

import { users } from "@/config/users";
import { sign, verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function connection(formData: FormData) {
  const userFound = users.find(
    (user) =>
      user.name === formData.get("login") &&
      user.password === formData.get("password")
  );

  if (userFound) {
    const token = sign(
      { login: userFound.name, role: userFound.role },
      process.env.JWT_SECRET || "",
      { expiresIn: "1h" }
    );

    await setCookie(token);

    redirect("/dashboard");
  }

  throw new Error("User not found");
}

export async function deconnection() {
  cookies().delete("accessToken");
  redirect("/");
}

export async function getUserConnected(login: string) {
  const userFound = users.find((user) => user.name === login);

  if (!userFound) {
    throw new Error("User not found");
  }

  return { login: userFound.name, role: userFound.role };
}

export async function setCookie(token: string) {
  cookies().set("accessToken", token);
}

export async function getAccessToken() {
  return JSON.stringify(cookies().get("accessToken"));
}

export async function validateToken(token: string) {
  try {
    const decodedToken = verify(token, process.env.JWT_SECRET || "");

    if (typeof decodedToken === "string") {
      throw new Error("Invalid token type");
    }

    return decodedToken;
  } catch (error) {
    console.error(error);
  }
}

export async function getRole(token: string): Promise<string | undefined> {
  const decodedToken = await validateToken(token);

  return decodedToken?.role;
}
