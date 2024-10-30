"use server";

import { z } from "zod";
import { AuthError } from "next-auth";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { eq } from "drizzle-orm";

const logInSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .min(1, "É necessário informar um email"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export const login = async (values: z.infer<typeof logInSchema>) => {
  try {
    const validatedValues = logInSchema.safeParse(values);

    if (!validatedValues.success) {
      return { error: validatedValues.error };
    }

    const { email, password } = validatedValues.data;

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!existingUser || !existingUser.email || !existingUser.password) {
      return { success: false, message: "Email não cadastrado!" };
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return { success: false, message: "Senha incorreta!" };
    }

    await signIn("credentials", { redirect: false, email, password });
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError) {
      switch (e.type) {
        case "CredentialsSignin":
          return { message: "Credenciais inválidas!" };
        default:
          return { message: "Algo deu errado!" };
      }
    }
  }
};
