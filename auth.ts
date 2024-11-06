import NextAuth from "next-auth";
import { db } from "@/db/drizzle";
import authConfig from "./auth.config";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { twoFactorConfirmation, account, users } from "@/db/schema";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      if (!user.id) {
        throw new Error("User ID is undefined");
      }

      await db
        .update(users)
        .set({ emailVerified: new Date() })
        .where(eq(users.id, user.id));
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.id) {
        throw new Error("User ID is undefined");
      }

      /* // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, user.id));

      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const [confirmation] = await db
          .select()
          .from(twoFactorConfirmation)
          .where(eq(twoFactorConfirmation.userId, existingUser.id));

        if (!confirmation) return false;

        // Delete two-factor confirmation for next sign in
        await db
          .delete(twoFactorConfirmation)
          .where(eq(twoFactorConfirmation.userId, existingUser.id)); // Corrected this line
      } */

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.image = token.image as string;
        session.user.role = token.role as "ADMIN" | "DOCTOR" | "PATIENT";
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, token.sub));

      if (!existingUser) return token;

      const [existingAccount] = await db
        .select()
        .from(account)
        .where(eq(account.userId, token.sub));

      token.role = existingUser.role || "ADMIN";
      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      token.image = existingUser.image;

      return token;
    },
  },
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
