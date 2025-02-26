"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { User, Mail, Phone, Lock, School, Undo } from "lucide-react" // Adding icons

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    university: "",
  })
  const [isCustomUniversity, setIsCustomUniversity] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleUniversityChange = (value: string) => {
    if (value === "custom") {
      setIsCustomUniversity(true)
      setFormData(prevState => ({ ...prevState, university: "" }))
    } else {
      setIsCustomUniversity(false)
      setFormData(prevState => ({ ...prevState, university: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
  
    const data = await res.json()
  
    if (res.ok) {
      toast({
        title: "Signup Successful",
        description: "Logging you in...",
      })
      
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (result?.error) {
        toast({
          title: "Login Failed",
          description: result.error,
          variant: "destructive",
        })
      } else {
        router.push("/")
      }

      setFormData({ name: "", email: "", phone: "", password: "", university: "" })
    } else {
      toast({
        title: "Signup Failed",
        description: data.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#5C67E5]/10 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-4xl font-bold text-center text-[#5C67E5] mb-4">Create Account</h1>
          <p className="text-center text-gray-600 mb-8">Join our learning community today</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="name" className="block text-sm font-medium text-[#5C67E5] mb-2">Full Name</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400"><User size={20} /></span>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="h-12 pl-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#5C67E5] focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-[#5C67E5] mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400"><Mail size={20} /></span>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-12 pl-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#5C67E5] focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="phone" className="block text-sm font-medium text-[#5C67E5] mb-2">Phone Number</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400"><Phone size={20} /></span>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="h-12 pl-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#5C67E5] focus:border-transparent"
                  placeholder="+91 1234567890"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-[#5C67E5] mb-2">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400"><Lock size={20} /></span>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="h-12 pl-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#5C67E5] focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="university" className="block text-sm font-medium text-[#5C67E5] mb-2">University/College</label>
              <div className="relative">
                <span className="absolute left-3 top-3 z-10 text-gray-400"><School size={20} /></span>
                {!isCustomUniversity ? (
                  <Select onValueChange={handleUniversityChange} value={formData.university}>
                    <SelectTrigger className="h-12 pl-10 rounded-xl">
                      <SelectValue placeholder="Select your university" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="galgotias-university">Galgotias University</SelectItem>
                      <SelectItem value="gl-bajaj">GL BAJAJ</SelectItem>
                      <SelectItem value="amity">AMITY</SelectItem>
                      <SelectItem value="custom">Enter Custom University</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="relative">
                    <Input
                      type="text"
                      id="university"
                      name="university"
                      value={formData.university}
                      onChange={handleChange}
                      required
                      className="h-12 pl-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#5C67E5] focus:border-transparent"
                      placeholder="Enter your university name"
                    />
                    <Button
                      type="button"
                      onClick={() => setIsCustomUniversity(false)}
                      className="absolute right-2 top-2 h-8 bg-[#5C67E5] hover:bg-[#4f5ed7] text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      <Undo className="mr-2 h-4 w-4" /> Back to List
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold bg-[#5C67E5] text-white hover:bg-[#4f5ed7] transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
