import { z } from "zod";

export const facultySchema = z.object({
  name: z.string().min(2, {
    error: "Name must be at least 2 characters",
  }),
  email: z.email({ error: "Invalid email address" }),
  role: z.enum(["admin", "teacher", "student"], {
    error: "Please select a valid role",
  }),
  department: z.uuid({ error: "Invalid department ID" }),
  image: z.url().optional(),
  imgCldPubId: z.string().optional(),
});

export const subjectSchema = z.object({
  name: z.string().min(3, {
    error: "Subject name must be at least 3 characters",
  }),
  code: z.string().min(2).max(10, {
    error: "Subject code must be 2-10 characters long",
  }),
  description: z.string().min(5, {
    error: "Subject description must be at least 5 characters",
  }),
  department: z.uuid({ error: "Invalid department ID" }),
});

export const scheduleSchema = z.object({
  day: z.string().min(1, { error: "day is required" }),
  startTime: z.string().min(1, { error: "start time is required" }),
  endTime: z.string().min(1, { error: "end time is required" }),
});

export const classSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(50, { error: "Class name must be 2-50 characters long" }),
  description: z.string().min(5, { error: "Class description must be at least 5 characters" }).optional(),
  subjectId: z.uuid({ error: "Invalid subject ID" }),
  teacherId: z.uuid({ error: "Invalid teacher ID" }),
  capacity: z.coerce
    .number()
    .min(1, { error: "Capacity must be at least 1" })
    .max(60, { error: "Capacity must be at most 60" })
    .optional(),
  bannerUrl: z.string().url({ error: "Invalid banner URL" }).optional(),
  bannerCldPubId: z.string().optional(),
  inviteCode: z.string().min(6).optional(),
  schedules: z.array(scheduleSchema),
});

export const enrollmentSchema = z.object({
  classId: z.uuid({ error: "Invalid class ID" }),
  studentId: z.uuid({ error: "Invalid student ID" }),
});

export type ClassType = z.infer<typeof classSchema>;
export type ClassInputType = z.input<typeof classSchema>;
export type FacultyType = z.infer<typeof facultySchema>;
export type SubjectType = z.infer<typeof subjectSchema>;
export type ScheduleType = z.infer<typeof scheduleSchema>;
export type EnrollmentType = z.infer<typeof enrollmentSchema>;
