"use client";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  
  return (
    <div className="bg-[#F7F7F6]">
      <section className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#6C462E] mb-4">Find and Purchase Courses for Your University</h1>
          <p className="text-xl text-[#81674F] mb-8">Enhance your learning with Uglearn's curated courses</p>
          <Button className="bg-[#F6BD6A] text-white hover:bg-[#6C462E]">
            <Link href="/courses">Explore Courses</Link>
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-[#6C462E] mb-8 text-center">Top Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>BBA Courses</CardTitle>
              <CardDescription>Management, Marketing, Finance, and more</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside">
                <li>Management Principles</li>
                <li>Marketing Fundamentals</li>
                <li>Financial Accounting</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="bg-[#F6BD6A] text-white hover:bg-[#6C462E]">
                <Link href="/courses?category=BBA">View BBA Courses</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>B.Tech Courses</CardTitle>
              <CardDescription>Data Structures, Circuit Theory, Engineering Math, and more</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside">
                <li>Data Structures and Algorithms</li>
                <li>Circuit Theory and Design</li>
                <li>Engineering Mathematics</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="bg-[#F6BD6A] text-white hover:bg-[#6C462E]">
                <Link href="/courses?category=BTech">View B.Tech Courses</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  )
}

