"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { users, patient, doctor } from "@/db/schema";
import { insertUserSchema as baseInsertUserSchema } from "@/db/schema";
import { signIn } from "@/auth";

const insertUserSchema = baseInsertUserSchema.extend({
  name: z.string().min(1, "É necessário informar um nome"),
  email: z
    .string()
    .email("Email inválido")
    .min(1, "É necessário informar um email"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  address: z.string().min(1, "É necessário informar um endereço"),
  city: z.string().min(1, "É necessário informar uma cidade"),
  state: z.string().min(1, "É necessário informar um estado"),
  postalCode: z.string().min(1, "É necessário informar um CEP"),
  phone: z.string().min(1, "É necessário informar um telefone"),
});

export const signUp = async (values: z.infer<typeof insertUserSchema>) => {
  try {
    const validatedValues = insertUserSchema.safeParse(values);

    if (!validatedValues.success) {
      return { error: "Campos inválidos" };
    }

    const {
      password,
      email,
      name,
      address,
      city,
      state,
      postalCode,
      phone,
      role,
      address2,
    } = validatedValues.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser) {
      return { error: "Email já cadastrado" };
    }

    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role,
        address,
        address2,
        city,
        state,
        postalCode,
        phone,
      })
      .returning();

    if (newUser) {
      if (newUser.role === "PATIENT") {
        await db.insert(patient).values({ userId: newUser.id });
      } else if (newUser.role === "DOCTOR") {
        await db.insert(doctor).values({ userId: newUser.id });
      }
    }

    await signIn("credentials", { redirect: false, email, password });
    return { success: true, message: "Usuário registrado com sucesso" };
  } catch (error) {
    console.error("Error during user sign-up:", error);
    return { error: "Erro interno no servidor. Tente novamente mais tarde." };
  }
};
