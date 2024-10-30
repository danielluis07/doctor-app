import { z } from "zod";
import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { users, review, insertReviewSchema } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";

const app = new Hono()
  .get("/", async (c) => {
    const data = await db.select().from(review);

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

      const [data] = await db.select().from(review).where(eq(review.id, id));

      return c.json({ data });
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
        .select()
        .from(review)
        .where(eq(review.doctorId, doctorId))
        .leftJoin(users, eq(users.id, review.userId));

      if (data.length === 0) {
        return c.json({ message: "No reviews found" }, 404);
      }

      return c.json({ data }, 200);
    }
  )
  .post("/", zValidator("json", insertReviewSchema), async (c) => {
    const values = c.req.valid("json");

    const [data] = await db.insert(review).values(values).returning();

    return c.json({ data });
  });

export default app;
