  'use client'

  import { useSession } from "next-auth/react"
  import { useEffect, useState } from "react"
  import Link from "next/link"
  import Image from "next/image"

  export default function PurchasedCourses() {
    const { data: session } = useSession()
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      const fetchPurchasedCourses = async () => {
        try {
          const response = await fetch('/api/purchases', {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          const data = await response.json()
          setCourses(data)
        } catch (error) {
          console.error('Error fetching courses:', error)
        } finally {
          setLoading(false)
        }
      }

      if (session?.user) {
        fetchPurchasedCourses()
      }
    }, [session])

    if (!session) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
          <p className="text-xl font-semibold text-gray-800 bg-white px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">Please login to view your courses</p>
        </div>
      )
    }

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">My Courses</span>
          </h1>
      
          {courses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg max-w-2xl mx-auto">
              <p className="text-2xl text-gray-700 mb-6">You haven't purchased any courses yet</p>
              <Link href="/courses" className="inline-block px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg">
                Browse Available Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course: any) => (
                <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
                  <div className="relative h-56">
                    <Image
                      src={course.imageUrl || '/placeholder-course.jpg'}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-3 text-gray-800">{course.title}</h2>
                    <p className="text-gray-600 mb-6 line-clamp-2">{course.description}</p>
                    <Link
                      href={`/courses/${course.id}`}
                      className="inline-block w-full text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transform hover:shadow-lg transition-all duration-300"
                    >
                      Continue Learning
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }
