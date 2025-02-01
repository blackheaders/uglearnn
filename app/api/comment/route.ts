import { NextResponse } from "next/server";
import { createComment, deleteComment, getComments } from "@/db/comments";


export async function GET(req: Request) {
  try {

    const { searchParams } = new URL(req.url);
    const contentId = searchParams.get('contentId');

    if (!contentId) {
      return NextResponse.json({ error: "contentId is required" }, { status: 400 });
    }
    const comments = await getComments(contentId);

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { contentId, parentId, userId, content } = await req.json();
    if (!contentId) {
      return NextResponse.json({ error: "contentId is required" }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }
    if (!content) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const comment = await createComment({
      contentId,
      parentId,
      userId,
      content,
    });

    return NextResponse.json(comment, { status: 200 });
  }
    catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
  
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const comment = await deleteComment(id);

    return NextResponse.json(comment, { status: 200 });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}