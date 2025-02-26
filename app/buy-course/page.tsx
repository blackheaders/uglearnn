"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Course } from "@/types/types";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  FaUniversity,
  FaBookOpen,
  FaCalendarAlt,
  FaShoppingCart,
  FaSpinner,
} from "react-icons/fa";
import UploadPopup from "@/components/UploadPopup";
import { toast } from "sonner";

export default function BuyCoursePage() {
  const [course, setCourse] = useState<Course | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [courseId, setCourseId] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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
      setIsLoading(true);
      try {
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
      } catch (error) {
        toast.error("Failed to load course details");
      } finally {
        setIsLoading(false);
      }
    };

    checkCourseAccess();
  }, [courseId, session, status, router]);

  const handleImageUpload = async (imageUrl: string) => {
    setIsUploading(true);
    setShowUploadModal(false);
    try {
      const response = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          //@ts-ignore
          userId: session?.user?.id,
          courseId: course?.id,
          screenshot: imageUrl,
          amount: course?.price
        }),
      });
    
      if (response.ok) {
        setShowThankYouModal(true);
        toast.success("Payment proof uploaded successfully");
      } else {
        toast.error("Failed to upload payment proof");
      }
    } catch (error) {
      toast.error("An error occurred while uploading payment proof");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading || !course)
    return (
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
                    <button 
                      onClick={() => {
                        setShowQRModal(true);
                        toast.info("Please scan the QR code to make payment");
                      }} 
                      disabled={isLoading || isUploading}
                      className="inline-block px-8 py-3 text-lg w-full text-center font-semibold text-white bg-gradient-to-r from-blue-500 to-[#5C67E5] rounded-xl hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50">
                      {isLoading || isUploading ? (
                        <FaSpinner className="animate-spin inline mr-2" />
                      ) : (
                        `Pay Rs. ${course.price.toFixed(2)}`
                      )}
                    </button>
                  </>
                ) : (
                  <div className="text-center text-gray-600 p-4 bg-gray-100 rounded-lg">
                    Please sign in to purchase this course
                  </div>
                )}
              </div>
            </div>
          </div>

          {showQRModal && (
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-2xl max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-[#5C67E5] to-blue-500 bg-clip-text text-transparent">Scan QR to Pay</h3>
                  <button
                    onClick={() => setShowQRModal(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200 text-xl">
                    ✕
                  </button>
                </div>
                <div className="text-center">
                  <p className="mb-6 text-lg text-gray-700 font-medium">
                    Amount to pay: <span className="text-[#5C67E5] font-bold">Rs. {course.price.toFixed(2)}</span>
                  </p>
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mb-6">
                    <Image
                      src="/qrcode.jpg"
                      alt="Payment QR Code"
                      width={300}
                      height={300}
                      className="mx-auto"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setShowQRModal(false);
                      setShowUploadModal(true);
                    }}
                    disabled={isUploading}
                    className="w-full bg-gradient-to-r from-[#5C67E5] to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-[#4f5ed7] hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50">
                    {isUploading ? (
                      <FaSpinner className="animate-spin inline mr-2" />
                    ) : (
                      "Upload Payment Proof"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
          {showUploadModal && (
            <UploadPopup
              onSuccess={handleImageUpload}
              onClose={() => setShowUploadModal(false)}
            />
          )}
          {showThankYouModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl max-w-md w-full">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-[#5C67E5] mb-4">Thank You!</h3>
                  <p className="text-gray-600 mb-6">
                    Your payment proof has been submitted successfully. You will receive access to your course within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setShowThankYouModal(false);
                      toast.success("You will access cource once your payment is verified");
                      router.push('/courses');
                    }}
                    className="w-full bg-[#5C67E5] text-white py-2 rounded-lg hover:bg-[#4f5ed7]">
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
