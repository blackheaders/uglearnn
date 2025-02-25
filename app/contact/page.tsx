"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'sonner'
export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        toast.success("Message Sent", {
          description: "We've received your message and will get back to you soon.",
        })
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        toast.error("Error", {
          description: "Something went wrong. Please try again later.",
        })
      }
    } catch (error) {
      toast.error("Error", {
        description: "Something went wrong. Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="container mx-auto px-6 py-12 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-[#5C67E5] mb-6 animate-fade-in">Contact Us</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isLoading}
            placeholder="Enter your name"
            className="rounded-lg border-gray-300 focus:ring-[#5C67E5] focus:border-[#5C67E5]"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
            placeholder="Enter your email"
            className="rounded-lg border-gray-300 focus:ring-[#5C67E5] focus:border-[#5C67E5]"
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <Input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            disabled={isLoading}
            placeholder="Enter subject"
            className="rounded-lg border-gray-300 focus:ring-[#5C67E5] focus:border-[#5C67E5]"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            disabled={isLoading}
            placeholder="Enter your message"
            className="rounded-lg border-gray-300 focus:ring-[#5C67E5] focus:border-[#5C67E5]"
          />
        </div>
        <Button type="submit" className="w-full bg-[#5C67E5] text-white hover:bg-[#4f5ed7] transition duration-200 rounded-lg py-2 text-lg font-medium" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  )
}