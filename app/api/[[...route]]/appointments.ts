import { z } from "zod";
import { Hono } from "hono";
import { db } from "@/db/drizzle";
import {
  appointment,
  doctor,
  doctorAvailability,
  patient,
  users,
} from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { insertAppointmentSchema } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";

const app = new Hono()
  .get("/", async (c) => {
    const data = await db.select().from(appointment);

    if (!data || data.length === 0) {
      return c.json({ message: "No appointments found" }, 404);
    }

    return c.json({ data });
  })
  .get(
    "/doctor/appointment/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      const [data] = await db
        .select({
          appointment: appointment,
          patient: patient,
          user: {
            name: users.name,
          },
        })
        .from(appointment)
        .where(eq(appointment.id, id))
        .leftJoin(patient, eq(appointment.patientId, patient.id))
        .leftJoin(users, eq(patient.userId, users.id));

      if (!data) {
        return c.json({ message: "No appointment found" }, 404);
      }

      return c.json({ data }, 200);
    }
  )
  .get(
    "/patient/appointment/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      const [data] = await db
        .select({
          appointment: appointment,
          doctor: doctor,
          user: users,
        })
        .from(appointment)
        .where(eq(appointment.id, id))
        .leftJoin(doctor, eq(appointment.doctorId, doctor.id))
        .leftJoin(users, eq(doctor.userId, users.id));

      if (!data) {
        return c.json({ message: "No appointment found" }, 404);
      }

      return c.json({ data }, 200);
    }
  )
  .get(
    "/doctor/:doctorId",
    zValidator("param", z.object({ doctorId: z.string().optional() })),
    async (c) => {
      const { doctorId } = c.req.valid("param");

      if (!doctorId) {
        return c.json({ error: "Missing id" }, 400);
      }

      const data = await db
        .select({
          appointment: appointment,
          patient: patient,
          user: users,
        })
        .from(appointment)
        .where(eq(appointment.doctorId, doctorId))
        .leftJoin(patient, eq(appointment.patientId, patient.id))
        .leftJoin(users, eq(patient.userId, users.id));

      if (!data || data.length === 0) {
        return c.json({ message: "No appointments found" }, 404);
      }

      return c.json({ data }, 200);
    }
  )
  .get(
    "/patient/:patientId",
    zValidator("param", z.object({ patientId: z.string().optional() })),
    async (c) => {
      const { patientId } = c.req.valid("param");

      if (!patientId) {
        return c.json({ error: "Missing id" }, 400);
      }

      const data = await db
        .select({
          appointment: appointment,
          doctor: doctor,
          user: users,
        })
        .from(appointment)
        .where(eq(appointment.patientId, patientId))
        .leftJoin(doctor, eq(appointment.doctorId, doctor.id))
        .leftJoin(users, eq(doctor.userId, users.id));

      if (!data || data.length === 0) {
        return c.json({ message: "No appointments found" }, 404);
      }

      return c.json({ data }, 200);
    }
  )
  .post("/", zValidator("json", insertAppointmentSchema), async (c) => {
    const values = c.req.valid("json");

    if (
      !values.doctorId ||
      !values.availableDate ||
      !values.startTime ||
      !values.endTime
    ) {
      return c.json(
        { error: "Missing doctorId, availableDate or startTime" },
        400
      );
    }

    const [data] = await db.insert(appointment).values(values).returning();

    if (!data) {
      return c.json({ error: "Error while inserting data" }, 400);
    }

    await db
      .update(doctorAvailability)
      .set({ availabilityStatus: "UNAVAILABLE" })
      .where(
        and(
          eq(doctorAvailability.doctorId, values.doctorId),
          eq(doctorAvailability.availableDate, values.availableDate),
          eq(doctorAvailability.startTime, values.startTime),
          eq(doctorAvailability.endTime, values.endTime)
        )
      );

    return c.json({ data });
  })
  .post(
    "/delete-appointments",
    zValidator("json", z.object({ ids: z.array(z.string()) })),
    async (c) => {
      const values = c.req.valid("json");

      const data = await db
        .delete(appointment)
        .where(inArray(appointment.id, values.ids))
        .returning({
          id: appointment.id,
        });

      return c.json({ data }, 200);
    }
  )
  .patch(
    "/confirm/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      const [data] = await db
        .update(appointment)
        .set({
          status: "SCHEDULED",
          updatedAt: new Date(),
        })
        .where(eq(appointment.id, id))
        .returning();

      return c.json({ data }, 200);
    }
  )
  .patch(
    "/cancel/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      const [data] = await db
        .update(appointment)
        .set({
          status: "CANCELLED",
          updatedAt: new Date(),
        })
        .where(eq(appointment.id, id))
        .returning();

      return c.json({ data }, 200);
    }
  )
  .patch(
    "/complete/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      const [data] = await db
        .update(appointment)
        .set({
          status: "COMPLETED",
          updatedAt: new Date(),
        })
        .where(eq(appointment.id, id))
        .returning();

      return c.json({ data }, 200);
    }
  )
  .delete(
    "/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      const [data] = await db
        .delete(appointment)
        .where(eq(appointment.id, id))
        .returning({
          id: appointment.id,
        });

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data }, 200);
    }
  );

export default app;
