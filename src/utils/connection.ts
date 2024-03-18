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
  deleteCookie();
  redirect("/");
}

export async function setCookie(token: string) {
  cookies().set("accessToken", token);
}

export async function deleteCookie() {
  cookies().delete("accessToken");
}

export async function getAccessToken() {
  return JSON.stringify(cookies().get("accessToken"));
}

export async function validateToken(token: string) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const jwt = process.env.JWT_SECRET;

  try {
    const decodedToken = verify(token, jwt);

    if (typeof decodedToken === "string") {
      throw new Error("Invalid token type");
    }

    return decodedToken;
  } catch (error) {
    console.error(error);
  }
}

// Non catchable ver
export async function isAlreadyConnected(token: string) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const jwt = process.env.JWT_SECRET;

  const decodedToken = verify(token, jwt);

  if (typeof decodedToken === "string") {
    throw new Error("Invalid token type");
  }

  return decodedToken;
}

export async function getRole(token: string): Promise<string | undefined> {
  const decodedToken = await validateToken(token);

  return decodedToken?.role;
}
