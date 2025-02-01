"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { data: session } = useSession(); 
  
  return (
    <header className="bg-white shadow-sm z-40">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center bg-white">
        <Link href="/" className="text-2xl font-bold text-[#4f5ed7]">
          Uglearn
        </Link>
        <div className="hidden md:flex space-x-4">
          <Link href="/" className=" hover:text-[#4f5ed7]">
            Home
          </Link>
          <Link href="/courses" className="  hover:text-[#4f5ed7]">
            Courses
          </Link>
          {/* <Link href="/my-courses" className=" hover:text-[#4f5ed7]">
            My Courses
          </Link> */}
          <Link href="/about" className="  hover:text-[#4f5ed7]">
            About Us
          </Link>
          <Link href="/contact" className="  hover:text-[#4f5ed7]">
            Contact
          </Link>
        </div>

        {/* Conditionally render based on the session */}
        {session ? (
          <div className="flex items-center space-x-4">
            <span className="text-[#4f5ed7]">Hello, {session?.user?.name}</span>
            <Button
              variant="outline"
              className="bg-[#5C67E5] hover:bg-[#4f5ed7] text-white"
              onClick={() => signOut()}
            >
              Logout
            </Button>
            
          </div>
        ) : (
          <>
             
              <Link href="/signin">
                <Button
                  variant="outline"
                  className="bg-[#5C67E5] text-white hover:bg-[#4f5ed7]"
                >
                  Login
                </Button>
              </Link>
          </>
        )}
      </nav>
    </header>
  );
} 
