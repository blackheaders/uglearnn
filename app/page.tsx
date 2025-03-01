"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SwiperComponent, TeamSwiper } from "@/components/Swiper";
export default function Home() {
  return (
    <div className=" ">
      <div className="h-[35vh] max-sm:h-[18vh] w-full max-[1400px]:h-[25vh]">
        <SwiperComponent />
      </div>
      <div className="h-[40vh] max-sm:h-[30vh] w-full p-4 md:p-8 hover:cursor-grab">

    <TeamSwiper></TeamSwiper>
</div>
      <div className="] max-h-[45vh] px-2 sm:px-8 md:px-20 py-8 max-md:py-4 flex  justify-center">
        <div className=" max-w-screen-lg flex flex-col justify-around gap-8 h-full w-full">
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-center font-semibold leading-[1.8] max-sm:leading-normal">
            India's <span className="text-[#5C67E5]">first platform </span>{" "}
            offering customized solutions for 
            <span className="text-[#5C67E5]">UG courses</span>
          </h2>
          {/* <Button className="px-8 py-2 bg-[#5C67E5] hover:bg-[#4f5ed7] text-white text-lg rounded mx-auto">
            Get Started
          </Button> */}
        </div>
      </div>
      <div className="bg-gradient-to-b from-[#ffff] to-[#4f5ed7]">
        <section className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#5C67E5] mb-4">
            Enhance your learning with UGLearn's curated courses
            </h1>
            {/* <p className="text-xl text-black mb-8">
            </p> */}
            <Button className="bg-[#5C67E5] text-white hover:bg-[#4f5ed7]">
              <Link href="/courses">Explore Courses</Link>
            </Button>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold  mb-8 text-center">
            Top Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>BBA Courses</CardTitle>
                <CardDescription>
                  Management, Marketing, Finance, and more
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside">
                  <li>Management Principles</li>
                  <li>Marketing Fundamentals</li>
                  <li>Financial Accounting</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="bg-[#5C67E5] text-white hover:bg-[#4f5ed7]">
                  <Link href="/courses?category=BBA">View BBA Courses</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>B.Tech Courses</CardTitle>
                <CardDescription>
                  Data Structures, Circuit Theory, Engineering Math, and more
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside">
                  <li>Data Structures and Algorithms</li>
                  <li>IDS</li>
                  <li>Engineering Mathematics</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="bg-[#5C67E5] text-white hover:bg-[#4f5ed7]">
                  <Link href="/courses?category=BTech">
                    View B.Tech Courses
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

      </div>
    </div>
  );
}
