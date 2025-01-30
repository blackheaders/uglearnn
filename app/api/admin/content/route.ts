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