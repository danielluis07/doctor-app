import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  role: "ADMIN" | "DOCTOR" | "PATIENT";
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
