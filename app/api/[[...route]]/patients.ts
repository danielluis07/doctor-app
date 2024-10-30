import { z } from "zod";
import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { users, patient, appointment, doctor } from "@/db/schema";
import { asc, eq, and, gte, or } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";

const app = new Hono()
  .get("/", async (c) => {
    const data = await db
      .select()
      .from(patient)
      .leftJoin(users, eq(users.id, patient.userId));

    if (!data) {
      return c.json({ message: "No doctors found" }, 400);
    }

    return c.json({ data }, 200);
  })
  .get(
    "/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      const [data] = await db
        .select()
        .from(patient)
        .where(eq(patient.userId, id))
        .leftJoin(users, eq(users.id, patient.userId));

      if (!data) {
        return c.json({ message: "No patient found" }, 400);
      }

      return c.json({ data }, 200);
    }
  )
  .get(
    "/next-appointment/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      const now = new Date();

      const [data] = await db
        .select({
          appointment: appointment,
          doctor: doctor,
          user: users,
        })
        .from(appointment)
        .where(
          and(
            eq(appointment.patientId, id),
            gte(appointment.availableDate, now.toISOString().split("T")[0]),
            or(
              eq(appointment.availableDate, now.toISOString().split("T")[0]),
              gte(appointment.startTime, now.toTimeString().split(" ")[0])
            )
          )
        )
        .leftJoin(doctor, eq(appointment.doctorId, doctor.id))
        .leftJoin(users, eq(doctor.userId, users.id))
        .orderBy(asc(appointment.availableDate))
        .limit(1);

      if (!data) {
        return c.json({ message: "No appointments found" }, 404);
      }

      return c.json({ data }, 200);
    }
  );

export default app;
