import { NextResponse } from "next/server";
import prisma from "@/db"
export async function POST(req: Request) {
    try {
        const { courseId, userId } = await req.json();

        if (!courseId || !userId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const purchase = await prisma.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });

        return NextResponse.json({ hasCourse: !!purchase }, { status: 200 });
    } catch (error) {
        console.error("Error checking course access:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
