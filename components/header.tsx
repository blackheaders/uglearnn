"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function Header() {
  const { data: session } = useSession(); 
  
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

        {/* Conditionally render based on the session */}
        {session ? (
          <div className="flex items-center space-x-4">
            <span className="text-[#81674F]">Hello, {session?.user?.name}</span>
            <Button
              variant="outline"
              className="bg-[#F6BD6A] text-white hover:bg-[#6C462E]"
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
                  className="bg-[#F6BD6A] text-white hover:bg-[#6C462E]"
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
