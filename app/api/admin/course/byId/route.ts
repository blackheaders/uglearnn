import { NextResponse } from "next/server";
import { getCourse } from "@/db/courses";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const courseId = body.courseId || undefined;
    const course = await getCourse(courseId);
    return NextResponse.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
