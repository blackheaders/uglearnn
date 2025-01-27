import { z } from "zod"

const courseSchema = z.object({
    title: z.string().min(5, {
      message: "Title must be at least 5 characters long.",
    }),
    description: z.string().min(8, {
      message: "Description must be at least 8 characters long.",
    }),
    imageUrl: z.string().url({
      message: "Invalid URL format for imageUrl.",
    }),
    videoUrl: z.string().optional(),
    university: z.string().min(2, {
      message: "University name must be at least 2 characters long.",
    }),
    program: z.string().min(2, {
      message: "Program name must be at least 2 characters long.",
    }),
    price: z.number().min(0, {
      message: "Price must be at least 0.",
    }),
    gdlink: z.string().optional(),
    id: z.string().optional(),
  })

export type Course = z.infer<typeof courseSchema>