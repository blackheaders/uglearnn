"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CourseZ } from "@/types/types";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MotionCard = motion(Card);

export default function CoursesPage() {
  const [selectedUniversity, setSelectedUniversity] = useState<
    string | undefined
  >();
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [selectedSemester, setSelectedSemester] = useState<
    string | undefined
  >();
  const [isLoading, setIsLoading] = useState(true);

  const [courses, setCourses] = useState<CourseZ[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSelectedUniversity(params.get("university") || undefined);
    setSelectedCategory(params.get("category") || undefined);
    setSelectedSemester(params.get("semester") || undefined);
  }, []);

  // Add no-cache headers to the fetch request
  useEffect(() => {
    setIsLoading(true);
    fetch("/api/courses", {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate", // Disable caching
        Pragma: "no-cache", // Disable cache for HTTP/1.0
        Expires: "0", // Disable cache expiration
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setIsLoading(false);
      });
  }, []);

  const semesterOptions = Array.from({ length: 8 }, (_, i) =>
    i == 0 ? "1st" : i == 1 ? "2nd" : i == 2 ? "3rd" : `${i + 1}th`
  );

  // Utility function to normalize semester data (removes suffixes like st, nd, rd, th)
  const normalizeSemester = (semester: string) => {
    return semester
      .replace(/[^0-9a-zA-Z, ]/g, "")
      .replace(/\s+/g, " ")
      .trim(); // Removes extra characters and extra spaces
  };

  // Utility function to split and normalize the semester data (handles both commas and "and")
  const splitSemesters = (semesterString: string) => {
    return semesterString
      .split(/,\s*|\s+and\s+/) // Split by comma or by the word "and"
      .map((sem) => normalizeSemester(sem)); // Normalize each semester (remove suffixes and extra spaces)
  };
  // Filter courses based on selected filters and search query
  const filteredCourses = courses.filter((course) => {
    // Check if the course matches the selected filters
    const matchesUniversity =
      !selectedUniversity || course.university === selectedUniversity;
    const matchesCategory =
      !selectedCategory || course.program === selectedCategory;

    // Adjust semester filter to handle multiple semesters (splitting by commas or "and")
    const matchesSemester =
      !selectedSemester ||
      splitSemesters(course.semester).includes(
        normalizeSemester(selectedSemester)
      ); // Compare with normalized selected semester

    const matchesSearchQuery =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      matchesUniversity &&
      matchesCategory &&
      matchesSemester &&
      matchesSearchQuery
    );
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Available Courses</h1>
        <Input
          type="search"
          placeholder="Search courses..."
          className="w-[300px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <Select
          onValueChange={setSelectedUniversity}
          value={selectedUniversity}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select College/University" />
          </SelectTrigger>
          <SelectContent>
            {Array.from(
              new Set(courses.map((course) => course.university))
            ).map((university) => (
              <SelectItem key={university} value={university}>
                {university}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedCategory} value={selectedCategory}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {Array.from(new Set(courses.map((course) => course.program))).map(
              (program) => (
                <SelectItem key={program} value={program}>
                  {program}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedSemester} value={selectedSemester}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select Semester" />
          </SelectTrigger>
          <SelectContent>
            {semesterOptions.map((semester) => (
              <SelectItem key={semester} value={semester}>
                {semester}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5C67E5]"></div>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="show">
          {filteredCourses.map((course) => (
            <MotionCard
              key={course.title}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>
                  {course.university} - {course.program} - Semester{" "}
                  {course.semester}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {course.videoUrl ? (
                  <video
                    className="w-full h-40 object-cover mb-4"
                    autoPlay
                    loop
                    muted>
                    <source src={course.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    className="w-full h-40 object-cover mb-4"
                    src={course.imageUrl}
                    alt=""
                  />
                )}

                <p>{course.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                {course.price === 0 ? (
                  <span className="text-lg font-bold text-green-500">Free</span>
                ) : (
                  <span className="text-lg font-bold">Rs. {course.price}</span>
                )}
                {course.gdlink ? (
                  <Link href={`${course.gdlink}`}>
                    <Button className="bg-[#5C67E5] text-white hover:bg-[#4f5ed7]">
                      Drive Course
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/courses/${course.id}`}>
                    <Button className="bg-[#5C67E5] text-white hover:bg-[#4f5ed7]">
                      View Course
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </MotionCard>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
