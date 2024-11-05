import { Hono } from "hono";
import { handle } from "hono/vercel";
import users from "./users";
import appointments from "./appointments";
import availability from "./availability";
import doctors from "./doctors";
import reviews from "./reviews";
import patients from "./patients";
import favorites from "./favorites";

export const runtime = "nodejs";

const app = new Hono().basePath("/api");

const routes = app
  .route("/users", users)
  .route("/doctors", doctors)
  .route("/patients", patients)
  .route("/appointments", appointments)
  .route("/reviews", reviews)
  .route("/availability", availability)
  .route("/favorites", favorites);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof app;
