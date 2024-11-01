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
      const today = now.toISOString().split("T")[0];
      const currentTime = now.toTimeString().split(" ")[0];

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
            or(
              // Condition to get today’s appointments with a start time later than now
              and(
                eq(appointment.availableDate, today),
                gte(appointment.startTime, currentTime)
              ),
              // Or any future date appointments
              gte(appointment.availableDate, today)
            )
          )
        )
        .leftJoin(doctor, eq(appointment.doctorId, doctor.id))
        .leftJoin(users, eq(doctor.userId, users.id))
        .orderBy(
          asc(appointment.availableDate), // Order by soonest date
          asc(appointment.startTime) // Then by soonest time on that date
        )
        .limit(1);

      if (!data) {
        return c.json({ message: "No appointments found" }, 404);
      }

      return c.json({ data }, 200);
    }
  );

export default app;
