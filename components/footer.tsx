import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-[#6C462E] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Uglearn</h3>
            <p>Find and purchase courses for your university</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/courses">Courses</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <p>Email: info@uglearn.com</p>
            <p>Phone: +1 234 567 8900</p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>&copy; 2023 Uglearn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

