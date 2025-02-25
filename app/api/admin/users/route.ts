import { NextResponse } from "next/server";
import prisma from "@/db";

export async function POST(req: Request) {
  try {
    const { page = 1, search = "" } = await req.json();
    const pageSize = 10; // Number of users per page
    const skip = (page - 1) * pageSize;

    // Fetch users with optional search filtering
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      },
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });

    // Count total users for pagination
    const totalUsers = await prisma.user.count({
      where: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      },
    });

    return NextResponse.json({
      users,
      totalPages: Math.ceil(totalUsers / pageSize),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
