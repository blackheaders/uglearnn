import { NextRequest, NextResponse } from 'next/server';
import db from '@/db';
import { z } from 'zod';

const requestBodySchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters long.' }),
  description: z.string().min(8, { message: 'Description must be at least 8 characters long.' }),
  imageUrl: z
    .string()
    .url({ message: 'URL should be valid image URL.' })
    .or(z.string()),
  university: z.string().min(2, { message: 'University name must be at least 2 characters long.' }),
  semester: z.string().min(1, { message: 'Semester is required.' }),
  program: z.string().min(2, { message: 'Program name must be at least 2 characters long.' }),
  price: z.number().min(0, { message: 'Price must be a positive number.' }),  // Ensure price is a positive number
  videoUrl: z.string().optional(),  // Video URL is optional
  gdlink: z.string().optional(),  // Gdlink is optional
});

export async function POST(req: NextRequest) {
  const parseResult = requestBodySchema.safeParse(await req.json());

  // If the validation fails, return a 400 status with error details
  if (!parseResult.success) {
    return NextResponse.json(
      { error: parseResult.error.message },
      { status: 400 },
    );
  }

  // Destructure the validated data from the request body
  const {
    title,
    description,
    imageUrl,
    university,
    program,
    price,
    videoUrl,
    semester,
    gdlink,
  } = parseResult.data;

  // Create a new course in the database
  await db.course.create({
    data: {
      title,
      description,
      imageUrl,
      university,
      program,
      semester,
      price: Number(price) || 0,
      videoUrl,
      gdlink,
      // Remove the gdlink property if it's not part of the Course model
    },
  });

  // Return a success message and 200 status code
  return NextResponse.json(
    {
      message: 'Course is successfully added',
    },
    {
      status: 200,
    },
  );
}