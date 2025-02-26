import { NextResponse } from "next/server";
import db from "@/db";
import { sendAdminNotification } from "@/lib/email";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      db.notification.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          course: {
            select: {
              id: true,
              title: true
            }
          }
        }
      }),
      db.notification.count()
    ]);

    return NextResponse.json({
      notifications,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { userId, courseId, screenshot, amount } = await req.json();

  const notification = await db.notification.create({
    data: {
      userId,
      courseId,
      screenshot,
      amount,
      status: 'pending',
      createdAt: new Date(),
    },
    include: {
      user: true,
      course: true,
    },
  });

  await sendAdminNotification(notification);

  return NextResponse.json({ notification });
}