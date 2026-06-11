import { GraduationCap, School } from "lucide-react";

export const USER_ROLES = {
  STUDENT: "student",
  TEACHER: "teacher",
  ADMIN: "admin",
};

export const ROLE_OPTIONS = [
  {
    value: USER_ROLES.STUDENT,
    label: "student",
    icon: GraduationCap,
  },
  {
    value: USER_ROLES.TEACHER,
    label: "teacher",
    icon: School,
  },
];

export const MAX_FILE_SIZE = 3 * 1024 * 1024;
export const ALLOWED_TYPES = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/webp",
];

const getEnvVar = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
};

export const CLOUDINARY_UPLOAD_URL = getEnvVar("VITE_CLOUDINARY_UPLOAD_URL");
export const CLOUDINARY_CLOUD_NAME = getEnvVar("VITE_CLOUDINARY_CLOUD_NAME");
export const CLOUDINARY_UPLOAD_PRESET = getEnvVar(
  "VITE_CLOUDINARY_UPLOAD_PRESET",
);

export const BACKEND_BASE_URL = getEnvVar("VITE_BACKEND_BASE_URL");
export const BASE_URL = import.meta.env.VITE_API_URL;
export const ACCESS_TOKEN_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY;
export const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY;
export const REFRESH_TOKEN_URL = `${BASE_URL}/refresh-token`;

export const MOCK_TEACHERS = [
  { id: "550e8400-e29b-41d4-a716-446655440000", name: "Dr. Aisha Patel" },
  { id: "550e8400-e29b-41d4-a716-446655440001", name: "Prof. Rohan Mehta" },
  { id: "550e8400-e29b-41d4-a716-446655440002", name: "Dr. Priya Sharma" },
  { id: "550e8400-e29b-41d4-a716-446655440003", name: "Mr. Arjun Verma" },
  { id: "550e8400-e29b-41d4-a716-446655440004", name: "Ms. Kavita Nair" },
  { id: "550e8400-e29b-41d4-a716-446655440005", name: "Prof. Sameer Joshi" },
  { id: "550e8400-e29b-41d4-a716-446655440006", name: "Dr. Neha Gupta" },
  { id: "550e8400-e29b-41d4-a716-446655440007", name: "Mr. Vikram Singh" },
];
