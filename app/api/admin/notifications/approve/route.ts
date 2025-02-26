import { NextResponse } from "next/server";
import db from "@/db";

export async function POST(req: Request) {
  try {
    const { notificationId } = await req.json();

    const notification = await db.notification.findUnique({
      where: { id: notificationId },
      include: { user: true, course: true }
    });

    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    // Update notification status
    await db.notification.update({
      where: { id: notificationId },
      data: { status: "approved" }
    });

    // Grant course access by creating purchase record
    await db.purchase.create({
      data: {
        userId: notification.userId,
        courseId: notification.courseId,
        status: "done"
      }
    });

    return NextResponse.json({ message: "Payment approved successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to approve payment" }, { status: 500 });
  }
}
