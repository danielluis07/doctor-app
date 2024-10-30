import { z } from "zod";
import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { users, doctor, review } from "@/db/schema";
import { avg, count, eq, or, ilike } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { parse } from "path";

const app = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      z.object({ page: z.string().optional(), per_page: z.string().optional() })
    ),
    async (c) => {
      const page = parseInt(c.req.query("page") ?? "1");
      const perPage = parseInt(c.req.query("per_page") ?? "5");

      const offset = (page - 1) * perPage;

      const [totalCount] = await db.select({ count: count() }).from(doctor);

      const data = await db
        .select({
          doctor: doctor,
          user: users,
          averageRating: avg(review.rating) || 0,
          reviewsCount: count(review.id),
        })
        .from(doctor)
        .leftJoin(users, eq(users.id, doctor.userId))
        .leftJoin(review, eq(review.doctorId, doctor.id))
        .groupBy(doctor.id, users.id)
        .offset(offset)
        .limit(perPage);

      if (!data || data.length === 0) {
        return c.json({ message: "No doctors found" }, 400);
      }

      const formattedData = data.map((item) => {
        const roundedRating = parseFloat(Number(item.averageRating).toFixed(1));

        const roundToHalf = (num: number) => {
          return Math.round(num * 2) / 2;
        };

        return {
          id: item.doctor.id,
          name: item.user?.name,
          specialty: item.doctor.specialty,
          image: item.user?.image,
          education: item.doctor.education,
          doctor_office: item.doctor.doctor_office,
          gender: item.doctor.gender,
          cfm: item.doctor.cfm,
          bio: item.doctor.bio,
          price: item.doctor.price,
          state: item.user?.state,
          city: item.user?.city,
          averageRating: roundToHalf(roundedRating),
          reviewsCount: item.reviewsCount,
        };
      });

      return c.json(
        { data: formattedData, total: totalCount, page, perPage },
        200
      );
    }
  )
  .get(
    "/search",
    zValidator("query", z.object({ q: z.string().optional() })),
    async (c) => {
      const { q } = c.req.valid("query");

      const data = await db
        .select({
          doctor: doctor,
          user: users,
          averageRating: avg(review.rating) || 0,
          reviewsCount: count(review.id),
        })
        .from(doctor)
        .leftJoin(users, eq(users.id, doctor.userId))
        .leftJoin(review, eq(review.doctorId, doctor.id))
        .where(
          or(ilike(users.name, `%${q}%`), ilike(doctor.specialty, `%${q}%`))
        )
        .groupBy(doctor.id, users.id);

      if (!data) {
        return c.json({ data: [] });
      }

      const formattedData = data.map((item) => {
        const roundedRating = parseFloat(Number(item.averageRating).toFixed(1));

        const roundToHalf = (num: number) => {
          return Math.round(num * 2) / 2;
        };

        return {
          id: item.doctor.id,
          name: item.user?.name,
          specialty: item.doctor.specialty,
          image: item.user?.image,
          education: item.doctor.education,
          doctor_office: item.doctor.doctor_office,
          gender: item.doctor.gender,
          cfm: item.doctor.cfm,
          bio: item.doctor.bio,
          price: item.doctor.price,
          state: item.user?.state,
          city: item.user?.city,
          averageRating: roundToHalf(roundedRating),
          reviewsCount: item.reviewsCount,
        };
      });

      return c.json({ data: formattedData }, 200);
    }
  )
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
        .from(doctor)
        .where(eq(doctor.userId, id))
        .leftJoin(users, eq(users.id, doctor.userId));

      if (!data) {
        return c.json({ message: "No doctor found" }, 400);
      }

      const formattedData = {
        doctor: {
          id: data.doctor.id,
          name: data.user?.name,
          email: data.user?.email,
          specialty: data.doctor.specialty,
          image: data.user?.image,
          education: data.doctor.education,
          doctor_office: data.doctor.doctor_office,
          gender: data.doctor.gender,
          cfm: data.doctor.cfm,
          price: data.doctor.price,
          bio: data.doctor.bio,
        },
      };

      return c.json({ data: formattedData }, 200);
    }
  );

export default app;
