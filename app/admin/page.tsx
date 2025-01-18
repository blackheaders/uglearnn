"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export default function AdminDashboard() {
  const [universityForm, setUniversityForm] = useState({ name: "" })
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    price: "",
    university: "",
    category: "",
    video: null as File | null,
    notes: null as File | null,
    slides: null as File | null,
  })

  const handleUniversitySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("University added:", universityForm)
    toast({
      title: "University Added",
      description: `${universityForm.name} has been added successfully.`,
    })
    setUniversityForm({ name: "" })
  }

  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Course added:", courseForm)
    toast({
      title: "Course Added",
      description: `${courseForm.title} has been added successfully.`,
    })
    setCourseForm({
      title: "",
      description: "",
      price: "",
      university: "",
      category: "",
      video: null,
      notes: null,
      slides: null,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCourseForm({
        ...courseForm,
        [e.target.name]: e.target.files[0],
      })
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold text-[#6C462E] mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-[#81674F] mb-4">Add University</h2>
          <form onSubmit={handleUniversitySubmit}>
            <div className="mb-4">
              <label htmlFor="universityName" className="block text-sm font-medium text-[#81674F] mb-1">University Name</label>
              <Input
                type="text"
                id="universityName"
                value={universityForm.name}
                onChange={(e) => setUniversityForm({ name: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="bg-[#F6BD6A] text-white hover:bg-[#6C462E]">
              Add University
            </Button>
          </form>
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold text-[#81674F] mb-4">Add Course</h2>
          <form onSubmit={handleCourseSubmit}>
            <div className="mb-4">
              <label htmlFor="courseTitle" className="block text-sm font-medium text-[#81674F] mb-1">Course Title</label>
              <Input
                type="text"
                id="courseTitle"
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="courseDescription" className="block text-sm font-medium text-[#81674F] mb-1">Course Description</label>
              <Textarea
                id="courseDescription"
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="coursePrice" className="block text-sm font-medium text-[#81674F] mb-1">Course Price</label>
              <Input
                type="number"
                id="coursePrice"
                value={courseForm.price}
                onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="courseUniversity" className="block text-sm font-medium text-[#81674F] mb-1">University</label>
              <Select onValueChange={(value) => setCourseForm({ ...courseForm, university: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select university" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="example-university">Example University</SelectItem>
                  <SelectItem value="tech-institute">Tech Institute</SelectItem>
                  {/* Add more universities as needed */}
                </SelectContent>
              </Select>
            </div>
            <div className="mb-4">
              <label htmlFor="courseCategory" className="block text-sm font-medium text-[#81674F] mb-1">Category</label>
              <Select onValueChange={(value) => setCourseForm({ ...courseForm, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bba">BBA</SelectItem>
                  <SelectItem value="btech">B.Tech</SelectItem>
                  {/* Add more categories as needed */}
                </SelectContent>
              </Select>
            </div>
            <div className="mb-4">
              <label htmlFor="courseVideo" className="block text-sm font-medium text-[#81674F] mb-1">Course Video</label>
              <Input
                type="file"
                id="courseVideo"
                name="video"
                accept="video/*"
                onChange={handleFileChange}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="courseNotes" className="block text-sm font-medium text-[#81674F] mb-1">Course Notes (PDF)</label>
              <Input
                type="file"
                id="courseNotes"
                name="notes"
                accept=".pdf"
                onChange={handleFileChange}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="courseSlides" className="block text-sm font-medium text-[#81674F] mb-1">Course Slides (PPT)</label>
              <Input
                type="file"
                id="courseSlides"
                name="slides"
                accept=".ppt,.pptx"
                onChange={handleFileChange}
                required
              />
            </div>
            <Button type="submit" className="bg-[#F6BD6A] text-white hover:bg-[#6C462E]">
              Add Course
            </Button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  )
}

