import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-[#6C462E]">
          Uglearn
        </Link>
        <div className="hidden md:flex space-x-4">
          <Link href="/" className="text-[#81674F] hover:text-[#6C462E]">
            Home
          </Link>
          <Link href="/courses" className="text-[#81674F] hover:text-[#6C462E]">
            Courses
          </Link>
          <Link href="/my-courses" className="text-[#81674F] hover:text-[#6C462E]">
            My Courses
          </Link>
          <Link href="/about" className="text-[#81674F] hover:text-[#6C462E]">
            About Us
          </Link>
          <Link href="/contact" className="text-[#81674F] hover:text-[#6C462E]">
            Contact
          </Link>
        </div>
        <Button variant="outline" className="bg-[#F6BD6A] text-white hover:bg-[#6C462E]">
          Login
        </Button>
      </nav>
    </header>
  )
}

