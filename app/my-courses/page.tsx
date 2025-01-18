"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// This would typically come from an API call to the backend
const purchasedCourses = [
  {
    id: 1,
    title: "Management Principles",
    description: "Learn the fundamentals of management and leadership",
    university: "Example University",
    category: "BBA",
    progress: 25,
  },
  {
    id: 2,
    title: "Data Structures and Algorithms",
    description: "Master the core concepts of computer science",
    university: "Tech Institute",
    category: "BTech",
    progress: 50,
  },
]

const MotionCard = motion(Card)

export default function MyCourses() {
  const [courses, setCourses] = useState(purchasedCourses)

  useEffect(() => {
    // In a real application, you would fetch the user's purchased courses here
    // For now, we'll use the mock data
  }, [])

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold text-[#6C462E] mb-8">My Courses</h1>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="show"
      >
        {courses.map((course) => (
          <MotionCard 
            key={course.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>{course.university} - {course.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{course.description}</p>
              <div className="mt-4">
                <div className="text-sm font-medium">Progress: {course.progress}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                  <div 
                    className="bg-[#F6BD6A] h-2.5 rounded-full" 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/courses/${course.id}`}>
                <Button className="w-full bg-[#F6BD6A] text-white hover:bg-[#6C462E]">
                  Continue Learning
                </Button>
              </Link>
            </CardFooter>
          </MotionCard>
        ))}
      </motion.div>
    </motion.div>
  )
}

