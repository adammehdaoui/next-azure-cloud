import { Role } from "@/utils/validators/roles";

export type User = {
  name: string;
  password: string;
  role: Role;
};
