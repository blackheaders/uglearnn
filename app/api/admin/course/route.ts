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
export async function DELETE(req: Request) {
  try {
    const { id: courseId } = await req.json();

    // Step 1: Find all content IDs associated with the course
    const courseContent = await db.content.findMany({
      where: { courseId },
      select: { id: true },
    });

    const contentIds = courseContent.map((content) => content.id);

    if (contentIds.length > 0) {
      // Step 2: Recursively delete all nested content (child content)
      await deleteContentRecursively(contentIds);

      // Step 3: Delete all remaining content linked to the course
      await db.content.deleteMany({
        where: { courseId },
      });
    }

    // Step 4: Delete the course itself
    await db.course.delete({
      where: { id: courseId },
    });

    return NextResponse.json(
      { message: "Course and all related data deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Error deleting course and its related data" },
      { status: 500 }
    );
  }
}

async function deleteContentRecursively(contentIds: string[]) {
  if (contentIds.length === 0) return;

  // Step 1: Find all child content
  const childContent = await db.content.findMany({
    where: { parentId: { in: contentIds } },
    select: { id: true },
  });

  const childContentIds = childContent.map((content) => content.id);

  // Step 2: Find all comments linked to the content
  const comments = await db.comment.findMany({
    where: { contentId: { in: contentIds } },
    select: { id: true },
  });

  const commentIds = comments.map((comment) => comment.id);

  // Step 3: Delete votes related to comments
  if (commentIds.length > 0) {
    await db.vote.deleteMany({
      where: { commentId: { in: commentIds } },
    });

    // Step 4: Recursively delete child comments (nested comments)
    await deleteCommentsRecursively(commentIds);

    // Step 5: Delete comments
    await db.comment.deleteMany({
      where: { contentId: { in: contentIds } },
    });
  }

  // Step 6: Recursively delete child content
  if (childContentIds.length > 0) {
    await deleteContentRecursively(childContentIds);
  }

  // Step 7: Finally, delete the parent content
  await db.content.deleteMany({
    where: { id: { in: contentIds } },
  });
}


async function deleteCommentsRecursively(commentIds: string[]) {
  if (commentIds.length === 0) return;

  // Step 1: Find all child comments
  const childComments = await db.comment.findMany({
    where: { parentId: { in: commentIds } },
    select: { id: true },
  });

  const childCommentIds = childComments.map((comment) => comment.id);

  // Step 2: Delete votes related to child comments
  if (childCommentIds.length > 0) {
    await db.vote.deleteMany({
      where: { commentId: { in: childCommentIds } },
    });

    // Step 3: Recursively delete child comments
    await deleteCommentsRecursively(childCommentIds);

    // Step 4: Delete child comments
    await db.comment.deleteMany({
      where: { id: { in: childCommentIds } },
    });
  }

  // Step 5: Delete parent comments
  await db.comment.deleteMany({
    where: { id: { in: commentIds } },
  });
}

