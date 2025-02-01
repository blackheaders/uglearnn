import { AddVote } from "@/db/comments";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const { commentId, userId, voteType } = await req.json();
    if (!commentId) {
      return NextResponse.json({ error: "commentId is required" }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }
    if (!voteType) {
      return NextResponse.json({ error: "voteType is required" }, { status: 400 });
    }

    const vote = AddVote({
      commentId,
      userId,
      voteType,
    });
    return NextResponse.json(vote, { status: 200 });
  } catch (error) {
    console.error("Error adding vote:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}