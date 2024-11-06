"use server";

import { z } from "zod";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

const updateUserSchema = z.object({
  image: z.string().optional(),
  name: z.string().min(1, "É necessário informar um nome"),
  email: z
    .string()
    .email("Email inválido")
    .min(1, "É necessário informar um email"),
  currentPassword: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres"),
  newPassword: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export const updateUser = async (values: z.infer<typeof updateUserSchema>) => {
  try {
    const validatedValues = updateUserSchema.safeParse(values);

    if (!validatedValues.success) {
      return { error: validatedValues.error };
    }

    const { email, currentPassword, newPassword, image } = validatedValues.data;

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!existingUser || !existingUser.email || !existingUser.password) {
      return { success: false, message: "Email não cadastrado!" };
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      existingUser.password
    );

    if (!isPasswordValid) {
      return { success: false, message: "Senha incorreta!" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [data] = await db
      .update(users)
      .set({
        email,
        password: hashedPassword,
        image,
      })
      .where(eq(users.email, email))
      .returning();

    if (!data) {
      return {
        success: false,
        message: "Algo deu errado durante a atualização!",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error during user sign-up:", error);
    return { error: "Erro interno no servidor. Tente novamente mais tarde." };
  }
};
