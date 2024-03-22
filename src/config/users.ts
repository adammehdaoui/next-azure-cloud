import type { User } from "@/utils/validators/user-types";
import { Role } from "@/utils/validators/roles";

export const users: Readonly<User[]> = [
  {
    name: "user-admin",
    password: "user-admin",
    role: Role.PowerUser,
  },
  {
    name: "user-contributor",
    password: "user-contributor",
    role: Role.LimitedUser,
  },
  {
    name: "user-restricted",
    password: "user-restricted",
    role: Role.RestrictedUser,
  },
] as const;
