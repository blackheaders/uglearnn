import { NextResponse } from "next/server";
import { getFullContent } from "@/db/courses";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const courseId = body.courseId || undefined;
    const parentId = body.parentId || undefined;

    const content = await getFullContent(courseId, parentId);
    return NextResponse.json(content);
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
