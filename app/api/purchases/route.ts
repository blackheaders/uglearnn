import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import prisma from "@/db"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const purchases = await prisma.purchase.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        course: true
      }
    })

    const courses = purchases.map(purchase => purchase.course)
    
    return NextResponse.json(courses)
  } catch (error) {
    console.error("Error fetching purchased courses:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
