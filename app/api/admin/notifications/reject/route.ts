import { NextResponse } from "next/server";
import db from "@/db";

export async function POST(req: Request) {
  try {
    const { notificationId } = await req.json();

    await db.notification.update({
      where: { id: notificationId },
      data: { status: "rejected" }
    });

    return NextResponse.json({ message: "Payment rejected successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to reject payment" }, { status: 500 });
  }
}
