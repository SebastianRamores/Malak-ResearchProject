import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  role: z.enum(['admin', 'student']),
  username: z.string(),
  password: z.string(),
  name: z.string(),
  studentId: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  section: z.string().nullable().optional(),
});

export const InsertUserSchema = UserSchema.omit({ id: true });

export const SubjectSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
});

export const InsertSubjectSchema = SubjectSchema.omit({ id: true });

export const ActivitySchema = z.object({
  id: z.number(),
  subjectId: z.number(),
  title: z.string(),
  description: z.string().nullable().optional(),
  deadline: z.string(),
  type: z.enum(['Quiz', 'Assignment', 'Project', 'Exam']),
  points: z.number(),
});

export const InsertActivitySchema = ActivitySchema.omit({ id: true });

export const AnnouncementSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  createdAt: z.string(),
});

export const InsertAnnouncementSchema = AnnouncementSchema.omit({ id: true });

export const MaterialSchema = z.object({
  id: z.number(),
  subjectId: z.number(),
  title: z.string(),
  description: z.string().nullable().optional(),
  url: z.string().optional(),
  type: z.enum(['Link', 'PDF', 'Video', 'Document', 'Reading']),
  pages: z.array(z.string()).optional(),
});

export const InsertMaterialSchema = MaterialSchema.omit({ id: true });

export type User = z.infer<typeof UserSchema>;
export type InsertUser = z.infer<typeof InsertUserSchema>;
export type Subject = z.infer<typeof SubjectSchema>;
export type InsertSubject = z.infer<typeof InsertSubjectSchema>;
export type Activity = z.infer<typeof ActivitySchema>;
export type InsertActivity = z.infer<typeof InsertActivitySchema>;
export type Announcement = z.infer<typeof AnnouncementSchema>;
export type InsertAnnouncement = z.infer<typeof InsertAnnouncementSchema>;
export type Material = z.infer<typeof MaterialSchema>;
export type InsertMaterial = z.infer<typeof InsertMaterialSchema>;
