import { z } from "zod";
import { Hono } from "hono";
import { db } from "@/db/drizzle";
import {
  users,
  patient,
  doctor,
  insertDoctorSchema,
  doctorAvailability,
  insertPatientSchema,
  review,
} from "@/db/schema";
import bcrypt from "bcryptjs";
import { zValidator } from "@hono/zod-validator";
import { insertUserSchema, notification } from "@/db/schema";
import { avg, count, eq } from "drizzle-orm";

const app = new Hono()
  .get("/", async (c) => {
    const data = await db.select().from(users);

    return c.json({ data });
  })
  .get(
    "/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      const [data] = await db.select().from(users).where(eq(users.id, id));

      return c.json({ data });
    }
  )
  .post("/", zValidator("json", insertUserSchema), async (c) => {
    const values = c.req.valid("json");

    if (!values.password || typeof values.password !== "string") {
      return c.json(
        { error: "Password is required and must be a string" },
        400
      );
    }

    const hashedPassword = await bcrypt.hash(values.password, 10);

    if (!values.email || typeof values.email !== "string") {
      return c.json({ error: "Email is required and must be a string" }, 400);
    }

    const [data] = await db
      .insert(users)
      .values({
        name: values.name,
        email: values.email,
        password: hashedPassword,
        role: values.role ?? null,
        address: values.address ?? null,
        address2: values.address2 ?? null,
        city: values.city ?? null,
        state: values.state ?? null,
        postalCode: values.postalCode ?? null,
        phone: values.phone ?? null,
      })
      .returning();

    if (data && data.role === "PATIENT") {
      await db.insert(patient).values({
        userId: data.id,
      });
    }

    if (data && data.role === "DOCTOR") {
      await db.insert(doctor).values({
        userId: data.id,
      });
    }

    return c.json({ data });
  })
  .patch(
    "/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator("json", insertUserSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      const [data] = await db
        .update(users)
        .set({
          ...values,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id))
        .returning();

      return c.json({ data });
    }
  )
  .get(
    "/patient/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      const [data] = await db
        .select()
        .from(patient)
        .where(eq(patient.id, id))
        .leftJoin(users, eq(patient.userId, users.id));

      if (!data) {
        return c.json({ message: "No patient found" }, 404);
      }

      return c.json({ data });
    }
  )
  .get(
    "/doctor/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      const [data] = await db
        .select({
          doctor: doctor,
          user: users,
          averageRating: avg(review.rating) || 0,
          reviewsCount: count(review.id),
        })
        .from(doctor)
        .where(eq(doctor.id, id))
        .leftJoin(users, eq(doctor.userId, users.id))
        .leftJoin(review, eq(review.doctorId, doctor.id))
        .groupBy(doctor.id, users.id);

      if (!data) {
        return c.json({ message: "No doctor found" }, 404);
      }

      return c.json({ data });
    }
  )
  .patch(
    "/doctor/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator(
      "json",
      insertDoctorSchema.pick({
        bio: true,
        cfm: true,
        gender: true,
        education: true,
        price: true,
        doctor_office: true,
        specialty: true,
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      const [data] = await db
        .update(doctor)
        .set({
          ...values,
          updatedAt: new Date(),
        })
        .where(eq(doctor.userId, id))
        .returning();

      return c.json({ data });
    }
  )
  .patch(
    "/patient/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator("json", insertPatientSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      const [data] = await db
        .update(patient)
        .set({
          ...values,
          updatedAt: new Date(),
        })
        .where(eq(patient.userId, id))
        .returning();

      return c.json({ data });
    }
  );

export default app;
