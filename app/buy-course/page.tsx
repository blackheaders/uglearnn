"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Course } from "@/types/types";
import { useSession } from "next-auth/react";
import { StripeCheckout } from "@/components/stripe-checkout";
import Image from "next/image";
import { FaUniversity, FaBookOpen, FaCalendarAlt, FaShoppingCart, FaSpinner } from 'react-icons/fa';

export default function BuyCoursePage() {
  const [course, setCourse] = useState<Course | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [courseId, setCourseId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCourseId(params.get("id"));
  }, []);
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }

    if (!session?.user || !courseId) return;

    const checkCourseAccess = async () => {
      const response = await fetch("/api/user/havecourse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          // @ts-ignore
          userId: session.user.id,
        }),
      });
      const { hasCourse } = await response.json();

      if (hasCourse) {
        router.push(`/courses/${courseId}`);
        return;
      }

      // Fetch course details only if user doesn't own it
      const courseResponse = await fetch("/api/admin/course/byId", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const courseData = await courseResponse.json();
      setCourse(courseData);
    };

    checkCourseAccess();
  }, [courseId, session, status, router]);
  const handlePaymentSuccess = async () => {
    if (!session?.user || !course) return;

    try {
      await fetch("/api/admin/users/saveCourse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          //@ts-ignore
          userId: session.user.id,
          courseIds: [course.id],
        }),
      });
      router.push(`/courses/${course.id}`);
    } catch (error) {
      console.error("Error saving course purchase:", error);
    }
  };

  if (!course) return (
    <div className="min-h-screen flex items-center justify-center">
      <FaSpinner className="animate-spin text-4xl text-[#5C67E5]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FaBookOpen className="text-[#5C67E5]" />
              {course.title}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="relative group">
                <Image
                  src={course.imageUrl}
                  alt={course.title}
                  width={400}
                  height={300}
                  className="rounded-lg object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg transition-all hover:bg-gray-100">
                  <FaUniversity className="text-xl text-[#5C67E5]" />
                  <div>
                    <h3 className="font-semibold text-gray-900">University</h3>
                    <p className="text-gray-600">{course.university}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg transition-all hover:bg-gray-100">
                  <FaBookOpen className="text-xl text-[#5C67E5]" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Program</h3>
                    <p className="text-gray-600">{course.program}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg transition-all hover:bg-gray-100">
                  <FaCalendarAlt className="text-xl text-[#5C67E5]" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Semester</h3>
                    <p className="text-gray-600">{course.semester}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                  <FaShoppingCart className="text-[#5C67E5]" />
                  Purchase Course
                </h2>
                <div className="text-4xl font-bold text-[#5C67E5] mb-6">
                  Rs .{course.price.toFixed(2)}
                </div>

                {session?.user ? (
                  <>
                  {/* <StripeCheckout
                    amount={course.price}
                    onSuccess={handlePaymentSuccess}
                  /> */}
                  <div className="inline-block px-8 py-3 text-lg w-full text-center font-semibold text-white bg-gradient-to-r from-blue-500 to-[#5C67E5] rounded-xl hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg">
                        Pay Rs. {course.price.toFixed(2)}
                    </div>
                    </>
                ) : (
                  <div className="text-center text-gray-600 p-4 bg-gray-100 rounded-lg">
                    Please sign in to purchase this course
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
