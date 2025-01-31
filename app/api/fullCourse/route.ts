import { NextResponse } from "next/server";
import prisma from "@/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id } = body;

    if (typeof id !== 'string') {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }

    let course = await prisma.course.findUnique({
        where: { id },
        include: {
          content: {
            include: {
              children: true, // Only include children if needed
            },
          },
        },
      });
      
      // Filter out content that has a parent (non-top-level content)
      //@ts-ignore
      const topLevelContent = course.content.filter(item => item.parentId === null);
      //@ts-ignore
      course.content = topLevelContent;
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
