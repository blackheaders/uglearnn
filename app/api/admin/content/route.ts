import { NextResponse } from "next/server";
import prisma from "@/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, type, thumbnail, courseId, parentContentId, videoUrl, pdfUrl, description } = body;

    // Validation
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!courseId && !parentContentId) {
      return NextResponse.json({
        error: "Content must belong to either a course or a parent content",
      }, { status: 400 });
    }

    let newPosition = 1;

    if (parentContentId) {
      const lastParentContent = await prisma.content.findFirst({
        where: { parentId: parentContentId },
        orderBy: { position: "desc" },
      });

      newPosition = lastParentContent ? lastParentContent.position + 1 : 1;
    } else if (courseId) {
      const lastCourseContent = await prisma.content.findFirst({
        where: { courseId: courseId },
        orderBy: { position: "desc" },
      });

      newPosition = lastCourseContent ? lastCourseContent.position + 1 : 1;
    }

    const content = await prisma.content.create({
      data: {
        title,
        type,
        description,
        thumbnail,
        videoUrl,
        pdfUrl,
        course: courseId ? { connect: { id: courseId } } : undefined,
        parent: parentContentId ? { connect: { id: parentContentId } } : undefined,
        position: newPosition,
      },
    });

    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    console.error("Error creating content:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function deleteCommentsRecursively(commentIds: string[]) {
  if (commentIds.length === 0) return;

  // Step 1: Find all child comments
  const childComments = await prisma.comment.findMany({
    where: { parentId: { in: commentIds } },
    select: { id: true },
  });

  const childCommentIds = childComments.map((comment) => comment.id);

  // Step 2: Delete votes related to child comments
  if (childCommentIds.length > 0) {
    await prisma.vote.deleteMany({
      where: { commentId: { in: childCommentIds } },
    });

    // Step 3: Recursively delete child comments
    await deleteCommentsRecursively(childCommentIds);

    // Step 4: Delete child comments
    await prisma.comment.deleteMany({
      where: { id: { in: childCommentIds } },
    });
  }

  // Step 5: Delete parent comments
  await prisma.comment.deleteMany({
    where: { id: { in: commentIds } },
  });
}

async function deleteContentWithChildren(contentIds: string[]) {
  if (contentIds.length === 0) return;

  // Step 1: Find all child content
  const childContent = await prisma.content.findMany({
    where: { parentId: { in: contentIds } },
    select: { id: true },
  });

  const childContentIds = childContent.map((content) => content.id);

  // Step 2: Recursively delete child content
  if (childContentIds.length > 0) {
    await deleteContentWithChildren(childContentIds);
    
    // Step 3: Delete child content
    await prisma.content.deleteMany({
      where: { id: { in: childContentIds } },
    });
  }

  // Step 4: Delete comments related to the content
  const comments = await prisma.comment.findMany({
    where: { contentId: { in: contentIds } },
    select: { id: true },
  });

  const commentIds = comments.map((comment) => comment.id);

  // Step 5: Delete associated votes for the comments
  if (commentIds.length > 0) {
    await prisma.vote.deleteMany({
      where: { commentId: { in: commentIds } },
    });

    // Step 6: Delete the comments
    await deleteCommentsRecursively(commentIds);
  }

  // Step 7: Delete content
  await prisma.content.deleteMany({
    where: { id: { in: contentIds } },
  });
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ error: "Content ID is required" }, { status: 400 });
    }

    // Step 1: Delete content and related data
    await deleteContentWithChildren([id]);

    return NextResponse.json({ message: "Content and related data deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting content:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
