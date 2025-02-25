import { NextResponse } from "next/server";
import prisma from "@/db";

export async function POST(req: Request) {
  try {
    const { userId, courseIds } = await req.json(); 

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    if (!Array.isArray(courseIds)) {
      return new NextResponse("Invalid courseIds format", { status: 400 });
    }

    await prisma.purchase.deleteMany({
      where: { userId },
    });

    if (courseIds.length > 0) {
      await prisma.purchase.createMany({
        data: courseIds.map((courseId) => ({
          userId,
          courseId,
          status: "done",
        })),
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[UPDATE_USER_COURSES]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}