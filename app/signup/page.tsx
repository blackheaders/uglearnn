"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    university: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleUniversityChange = (value: string) => {
    setFormData(prevState => ({ ...prevState, university: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Signup submitted:", formData)
    toast({
      title: "Signup Successful",
      description: "Welcome to Uglearn! You can now log in to your account.",
    })
    setFormData({ name: "", email: "", phone: "", password: "", university: "" })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#6C462E] mb-8">Sign Up</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-[#81674F] mb-1">Name</label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-[#81674F] mb-1">Email</label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-[#81674F] mb-1">Phone Number</label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-[#81674F] mb-1">Password</label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="university" className="block text-sm font-medium text-[#81674F] mb-1">University/College</label>
          <Select onValueChange={handleUniversityChange} value={formData.university}>
            <SelectTrigger>
              <SelectValue placeholder="Select your university" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="example-university">Example University</SelectItem>
              <SelectItem value="tech-institute">Tech Institute</SelectItem>
              {/* Add more universities as needed */}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full bg-[#F6BD6A] text-white hover:bg-[#6C462E]">
          Sign Up
        </Button>
      </form>
    </div>
  )
}

