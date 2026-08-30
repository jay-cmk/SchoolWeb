import { z } from "zod";

const objectId = z.string().regex(
  /^[0-9a-fA-F]{24}$/,
  "Invalid ObjectId"
);

export const createStudentSchema = z.object({
  sessionId: objectId,

  classId: objectId,

  sectionId: objectId,

  admissionNumber: z
    .string()
    .min(1)
    .max(50),

  rollNumber: z
    .number()
    .int()
    .positive()
    .optional(),

  name: z
    .string()
    .min(2)
    .max(100),

  dob: z.coerce.date().optional(),

  gender: z.enum([
    "MALE",
    "FEMALE",
    "OTHER"
  ]),

  mobile: z
    .string()
    .min(10)
    .max(15)
    .optional(),

  email: z
    .string()
    .email()
    .optional(),

  address: z
    .object({
      addressLine: z.string().optional(),
      city: z.string().optional(),
      district: z.string().optional(),
      state: z.string().optional(),
      pincode: z.string().optional()
    })
    .optional(),

  admissionDate: z.coerce.date().optional()
});

export const updateStudentSchema =
  createStudentSchema.partial().extend({
    status: z
      .enum([
        "ACTIVE",
        "INACTIVE",
        "TRANSFERRED",
        "PASSED",
        "LEFT"
      ])
      .optional()
  });