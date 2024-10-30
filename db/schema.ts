import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  date,
  text,
  timestamp,
  varchar,
  numeric,
  primaryKey,
  time,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import type { AdapterAccountType } from "next-auth/adapters";
import { createInsertSchema } from "drizzle-zod";

export const role = pgEnum("role", ["ADMIN", "PATIENT", "DOCTOR"]);

export const gender = pgEnum("gender", ["MALE", "FEMALE"]);

export const availabilityStatus = pgEnum("availability_status", [
  "AVAILABLE",
  "UNAVAILABLE",
]);

export const userStatus = pgEnum("user_status", [
  "ACTIVE",
  "INACTIVE",
  "PENDING",
]);

export const appointmentStatus = pgEnum("appointment_status", [
  "PENDING",
  "SCHEDULED",
  "CANCELLED",
  "COMPLETED",
]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").unique(),
  name: text("name"),
  password: varchar("password", { length: 255 }),
  image: text("image"),
  imageName: varchar("imageName", { length: 255 }),
  isTwoFactorEnabled: boolean("is_two_factor_enabled").default(false),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  address: varchar("address", { length: 255 }),
  address2: varchar("address2", { length: 255 }),
  city: varchar("city", { length: 255 }),
  state: varchar("state", { length: 255 }),
  phone: varchar("phone", { length: 255 }),
  postalCode: varchar("postal_code", { length: 255 }),
  role: role("role"),
  status: userStatus("user_status").default("PENDING").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const account = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const session = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationToken = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const authenticator = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

export const passwordResetToken = pgTable("password_reset_token", {
  id: varchar("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  expires: timestamp("expires").notNull(),
});

export const twoFactorToken = pgTable("two_factor_token", {
  id: varchar("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  expires: timestamp("expires").notNull(),
});

export const twoFactorConfirmation = pgTable("two_factor_confirmation", {
  id: varchar("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const patient = pgTable("patient", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  dateOfBirth: date("date_of_birth"),
  medicine: text("medicine"),
  alergies: text("alergies"),
  medicalHistory: text("medical_history"),
  familyHistory: text("family_history"),
  vaccine: text("vaccine"),
  lifeStyle: text("life_style"),
  gender: gender("gender"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const doctor = pgTable("doctor", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  specialty: varchar("specialty", { length: 255 }),
  education: varchar("education", { length: 255 }),
  doctor_office: varchar("doctor_office", { length: 255 }),
  gender: gender("gender"),
  price: varchar("price", { length: 255 }),
  cfm: varchar("cfm", { length: 255 }),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const doctorAvailability = pgTable(
  "doctor_availability",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    doctorId: text("doctor_id").references(() => doctor.id, {
      onDelete: "cascade",
    }),
    availableDate: date("available_date"),
    startTime: time("start_time"),
    endTime: time("end_time"),
    availabilityStatus: availabilityStatus("availability_status")
      .default("AVAILABLE")
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      uniqueAvailability: uniqueIndex("unique_doctor_availability").on(
        table.doctorId,
        table.availableDate,
        table.startTime,
        table.endTime
      ),
    };
  }
);

export const appointment = pgTable("appointments", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  patientId: text("patient_id").references(() => patient.id, {
    onDelete: "cascade",
  }),
  doctorId: text("doctor_id").references(() => doctor.id, {
    onDelete: "cascade",
  }),
  status: appointmentStatus("appointment_status").notNull(),
  availableDate: date("available_date"),
  startTime: time("start_time"),
  endTime: time("end_time"),
  medicalCondition: text("medical_condition"),
  address: varchar("address", { length: 255 }),
  address2: varchar("address2", { length: 255 }),
  doctorOffice: text("doctor_office"),
  city: text("city"),
  state: text("state"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const review = pgTable("review", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  doctorId: text("doctor_id").references(() => doctor.id, {
    onDelete: "cascade",
  }),
  rating: numeric("rating", { precision: 2, scale: 1 }).notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const notification = pgTable("notification", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  message: text("message").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  viewed: boolean("viewed").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const insertUserSchema = createInsertSchema(users);
export const insertDoctorSchema = createInsertSchema(doctor);
export const insertPatientSchema = createInsertSchema(patient);
export const insertDoctorAvailabilitySchema =
  createInsertSchema(doctorAvailability);
export const insertAppointmentSchema = createInsertSchema(appointment);
export const insertReviewSchema = createInsertSchema(review);
