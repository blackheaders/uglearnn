import { findContentById } from "@/db/courses";
import {  NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const contentId = body.contentId || undefined;

    const content = await findContentById(contentId);
    return NextResponse.json(content);
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}