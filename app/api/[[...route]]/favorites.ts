import { z } from "zod";
import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { favorites, users, doctor } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { insertFavoriteSchema } from "@/db/schema";

const app = new Hono()
  .get("/", async (c) => {
    const data = await db.select().from(favorites);

    if (!data || data.length === 0) {
      return c.json({ message: "No appointments found" }, 404);
    }

    return c.json({ data });
  })
  .get(
    "/patient/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      const data = await db
        .select({
          favorites: favorites,
          doctor: doctor,
          user: {
            name: users.name,
            image: users.image,
          },
        })
        .from(favorites)
        .where(eq(favorites.patientId, id))
        .leftJoin(doctor, eq(favorites.doctorId, doctor.id))
        .leftJoin(users, eq(doctor.userId, users.id));

      if (!data) {
        return c.json({ message: "No appointment found" }, 404);
      }

      return c.json({ data }, 200);
    }
  )
  .post(
    "/",
    zValidator(
      "json",
      insertFavoriteSchema.pick({ patientId: true, doctorId: true })
    ),
    async (c) => {
      const values = c.req.valid("json");

      if (!values) {
        return c.json({ error: "Missing patientId or doctorId" }, 400);
      }

      const data = await db.insert(favorites).values(values).returning();

      return c.json({ data }, 200);
    }
  )
  .delete(
    "/",
    zValidator(
      "json",
      insertFavoriteSchema.pick({ patientId: true, doctorId: true })
    ),
    async (c) => {
      const { doctorId, patientId } = c.req.valid("json");

      if (!doctorId || !patientId) {
        return c.json({ error: "Missing patientId or doctorId" }, 400);
      }

      const [data] = await db
        .delete(favorites)
        .where(
          and(
            eq(favorites.doctorId, doctorId),
            eq(favorites.patientId, patientId)
          )
        )
        .returning();

      if (!data) {
        return c.json({ message: "Not found" }, 404);
      }

      return c.json({ data }, 200);
    }
  );

export default app;
