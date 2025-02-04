
import { NextResponse } from "next/server";
import { getCourses } from "@/db/courses";

export async function GET() {
  try {
    const courses = await getCourses();
    return NextResponse.json(courses, {
      headers: {
        "Cache-Control": "no-store", // Disable all caching
      },
    });
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
