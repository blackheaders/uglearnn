"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { StripeCheckout } from "@/components/stripe-checkout"

const courses = [
  {
    id: 1,
    title: "Management Principles",
    description: "Learn the fundamentals of management and leadership",
    price: 99.99,
    university: "Example University",
    category: "BBA",
    videoUrl: "https://example.com/management-principles.mp4",
    notes: "https://example.com/management-principles-notes.pdf",
    slides: "https://example.com/management-principles-slides.pptx",
  },
  {
    id: 2,
    title: "Data Structures and Algorithms",
    description: "Master the core concepts of computer science",
    price: 129.99,
    university: "Tech Institute",
    category: "BTech",
    videoUrl: "https://example.com/data-structures.mp4",
    notes: "https://example.com/data-structures-notes.pdf",
    slides: "https://example.com/data-structures-slides.pptx",
  },
  // Add more courses here
]

const MotionCard = motion(Card)

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = parseInt(params.id as string)
  const course = courses.find(c => c.id === courseId)

  const [selectedTab, setSelectedTab] = useState("video")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  if (!course) {
    return <div>Course not found</div>
  }

  const handlePurchaseSuccess = () => {
    setIsDialogOpen(false)
    router.push("/my-courses")
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <MotionCard
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <CardHeader>
          <CardTitle>{course.title}</CardTitle>
          <CardDescription>{course.university} - {course.category}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{course.description}</p>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="video">Video Preview</TabsTrigger>
              <TabsTrigger value="details">Course Details</TabsTrigger>
            </TabsList>
            <motion.div
              key={selectedTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="video">
                <video className="w-full aspect-video" controls>
                  <source src={course.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </TabsContent>
              <TabsContent value="details">
                <ul className="list-disc list-inside">
                  <li>Full course video lectures</li>
                  <li>Comprehensive course notes (PDF)</li>
                  <li>Presentation slides (PPT)</li>
                  <li>24/7 support from instructors</li>
                  <li>Certificate upon completion</li>
                </ul>
              </TabsContent>
            </motion.div>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <span className="text-lg font-bold">${course.price}</span>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#F6BD6A] text-white hover:bg-[#6C462E]">
                Purchase Course
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Purchase Course</DialogTitle>
                <DialogDescription>
                  Complete your purchase for {course.title}
                </DialogDescription>
              </DialogHeader>
              <StripeCheckout amount={course.price} onSuccess={handlePurchaseSuccess} />
            </DialogContent>
          </Dialog>
        </CardFooter>
      </MotionCard>
    </motion.div>
  )
}

