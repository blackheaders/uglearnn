
import { NextResponse } from "next/server";
import db from '@/db';

export async function POST(req: Request) {
  const { courseId, gdlink } = await req.json();

  try {
    console.log(courseId, gdlink);
    await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        gdlink,
      },
    });
    return NextResponse.json({ message: "GDLink updated successfully" });
  }
  catch (error) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
