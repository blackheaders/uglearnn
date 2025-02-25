import { NextResponse } from "next/server";
import prisma from "@/db";

export async function POST(req: Request) {
  try {
    const { userId, timestamp } = await req.json();

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    const userCourses = await prisma.purchase.findMany({
      where: { userId },
    });

    const courseIds = userCourses.map((purchase) => purchase.courseId);

    return NextResponse.json({courseIds}, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("[USER_COURSES]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
