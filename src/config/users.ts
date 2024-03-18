import type { User } from "@/utils/validators/user-types";

export const users: Readonly<User[]> = [
  {
    name: "user-admin",
    password: "user-admin",
    role: "powerUser",
  },
  {
    name: "user-contributor",
    password: "user-contributor",
    role: "limitedUser",
  },
  {
    name: "user-restricted",
    password: "user-restricted",
    role: "restricedUser",
  },
] as const;
