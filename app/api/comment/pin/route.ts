import { createPinComment } from "@/db/comments";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: "id is required" }, { status: 400 });
        }

        const pinComment = await createPinComment(id);
        return NextResponse.json(pinComment, { status: 200 });

    }catch (error) {
        console.error("Error pinning comment:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}