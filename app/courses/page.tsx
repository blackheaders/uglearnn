"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Course } from "@/types/types"
import { Input } from "@/components/ui/input"

const MotionCard = motion(Card)

export default function CoursesPage() {
  const [selectedUniversity, setSelectedUniversity] = useState<string | undefined>()
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()
  const [courses, setCourses] = useState<Course[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCourses = courses.filter(course => 
    (!selectedUniversity || course.university === selectedUniversity) &&
    (!selectedCategory || course.program === selectedCategory) &&
    (course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     course.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  useEffect(() => {
    fetch('/api/courses')
    .then(res => res.json())
    .then(data => {
      setCourses(data)
    })
    .catch(error => {
      console.error('Error fetching courses:', error)
    })
  }, [])

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#6C462E]">Available Courses</h1>
        <Input
          type="search"
          placeholder="Search courses..."
          className="w-[300px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <Select onValueChange={setSelectedUniversity}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select University" />
          </SelectTrigger>
          <SelectContent>
            {Array.from(new Set(courses.map(course => course.university))).map((university) => (
              <SelectItem key={university} value={university}>{university}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {Array.from(new Set(courses.map(course => course.program))).map((program) => (
              <SelectItem key={program} value={program}>{program}</SelectItem>
            ))}
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
            key={course.title}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>{course.university} - {course.program}</CardDescription>
            </CardHeader>
            <CardContent>
              {course.videoUrl ? (
                <video className="w-full h-40 object-cover mb-4" autoPlay loop muted>
                  <source src={course.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img className="w-full h-40 object-cover mb-4" src={course.imageUrl} alt="" />
              )}
             
              <p>{course.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              {
                course.price === 0 ? (
                  <span className="text-lg font-bold text-green-500">Free</span>
                ) : (
                  <span className="text-lg font-bold">Rs. {course.price}</span>
                )
              }
              {course.gdlink ? (
                <Link href={`${course.gdlink}`}>
                  <Button className="bg-[#F6BD6A] text-white hover:bg-[#6C462E]">Drive Course</Button>
                </Link>
              ) : (
                <Link href={`/courses/${course.id}`}>
                  <Button className="bg-[#F6BD6A] text-white hover:bg-[#6C462E]">View Course</Button>
                </Link>
              )}
            </CardFooter>
          </MotionCard>
        ))}
      </motion.div>
    </motion.div>
  )
}
