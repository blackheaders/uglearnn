  import { NextResponse } from "next/server";
  import db from '@/db';

  export async function POST(req: Request) {
    try {
      const { timestamp } = await req.json();

      const courses = await db.course.findMany();

      return NextResponse.json(courses, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    } catch (error) {
      console.log("[COURSES]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }
