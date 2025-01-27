"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const courses = [
  {
    id: 1,
    title: "Management Principles",
    description: "Learn the fundamentals of management and leadership",
    price: 99.99,
    university: "Galgotias University",
    category: "BBA",
    videoUrl: "https://example.com/management-principles-preview.mp4",
    gdlink:"https://github.com/Khushwant-Singh1"
  },
  {
    id: 2,
    title: "Data Structures and Algorithms",
    description: "Master the core concepts of computer science",
    price: 129.99,
    university: "Galgotias University",
    category: "BTech",
    videoUrl: "https://example.com/data-structures-preview.mp4",
    gdlink:"https://github.com/Khushwant-Singh1"
  },
  // Add more courses here
]

const MotionCard = motion(Card)

export default function CoursesPage() {
  const [selectedUniversity, setSelectedUniversity] = useState<string | undefined>()
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()

  const filteredCourses = courses.filter(course => 
    (!selectedUniversity || course.university === selectedUniversity) &&
    (!selectedCategory || course.category === selectedCategory)
  )

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold text-[#6C462E] mb-8">Available Courses</h1>
      
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <Select onValueChange={setSelectedUniversity}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select University" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Galgotias University">Galgotias University</SelectItem>
            <SelectItem value="Tech Institute">Tech Institute</SelectItem>
          </SelectContent>
        </Select>
        
        <Select onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BBA">BBA</SelectItem>
            <SelectItem value="BTech">B.Tech</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
        {filteredCourses.map((course) => (
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
              <video className="w-full h-40 object-cover mb-4" controls>
                <source src={course.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <p>{course.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <span className="text-lg font-bold">${course.price}</span>
              {/* <Link href={`/courses/${course.id}`}>
                <Button className="bg-[#F6BD6A] text-white hover:bg-[#6C462E]">View Course</Button>
              </Link> */}
              <Link href={`${course.gdlink}`}>
              <Button className="bg-[#F6BD6A] text-white hover:bg-[#6C462E]">Ete Sloution Click Here</Button>
              </Link>
              
            </CardFooter>
          </MotionCard>
        ))}
      </motion.div>
    </motion.div>
  )
}

