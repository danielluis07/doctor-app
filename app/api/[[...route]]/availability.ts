import { z } from "zod";
import { Hono } from "hono";
import { db } from "@/db/drizzle";
import {
  users,
  patient,
  doctor,
  appointment,
  insertDoctorSchema,
  doctorAvailability,
  insertAppointmentSchema,
  insertDoctorAvailabilitySchema,
} from "@/db/schema";
import bcrypt from "bcryptjs";
import { zValidator } from "@hono/zod-validator";
import { insertUserSchema, notification } from "@/db/schema";
import { eq, and } from "drizzle-orm";

const app = new Hono()
  .get("/", async (c) => {
    const availabilityData = await db.select().from(doctorAvailability);

    if (!availabilityData || availabilityData.length === 0) {
      return c.json({ data: { availability: [] } }, 200);
    }

    const finalData = {
      availability: availabilityData.map((item) => ({
        id: item.id,
        doctorId: item.doctorId,
        availableDate: item.availableDate,
        startTime: item.startTime,
        endTime: item.endTime,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    };

    return c.json({ data: finalData });
  })
  .get(
    "/:doctorId",
    zValidator("param", z.object({ doctorId: z.string().optional() })),
    async (c) => {
      const { doctorId } = c.req.valid("param");

      if (!doctorId) {
        return c.json({ error: "Missing id" }, 400);
      }

      const availabilityData = await db
        .select()
        .from(doctorAvailability)
        .where(
          and(
            eq(doctorAvailability.doctorId, doctorId),
            eq(doctorAvailability.availabilityStatus, "AVAILABLE")
          )
        );

      if (!availabilityData || availabilityData.length === 0) {
        return c.json({ data: { availability: [] } }, 200);
      }

      const finalData = {
        availability: availabilityData.map((item) => ({
          id: item.id,
          doctorId: item.doctorId,
          availableDate: item.availableDate,
          startTime: item.startTime,
          endTime: item.endTime,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
      };

      return c.json({ data: finalData });
    }
  )
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        doctorId: z.string().optional().nullable(),
        availability: z.array(
          z.object({
            availableDate: z.string().optional().nullable(),
            startTime: z.string().optional().nullable(),
            endTime: z.string().optional().nullable(),
          })
        ),
      })
    ),
    async (c) => {
      const values = c.req.valid("json");

      if (!values.availability || values.availability.length === 0) {
        return c.json({ error: "Missing availability" }, 400);
      }

      const availabilityData = values.availability.map((slot) => ({
        doctorId: values.doctorId,
        availableDate: slot.availableDate,
        startTime: slot.startTime,
        endTime: slot.endTime,
      }));

      await db.insert(doctorAvailability).values(availabilityData).returning();

      return c.json({ data: availabilityData }, 200);
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
        .delete(doctorAvailability)
        .where(eq(doctorAvailability.id, id))
        .returning({
          id: doctorAvailability.id,
        });

      if (!data) {
        return c.json({ error: "Missing data" }, 404);
      }

      return c.json({ data });
    }
  );

export default app;
