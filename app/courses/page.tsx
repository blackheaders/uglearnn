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
import { Search, School, BookOpen, Calendar, FileVideo } from 'lucide-react';

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

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ timestamp: Date.now() }),
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

  const normalizeSemester = (semester: string) => {
    return semester
      .replace(/[^0-9a-zA-Z, ]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase(); 
  };

  const splitSemesters = (semesterString: string) => {
    return semesterString
      .split(/,\s*|\s+and\s+/) 
      .map((sem) => normalizeSemester(sem)); 
  };
  const filteredCourses = courses.filter((course) => {
    const matchesUniversity =
      !selectedUniversity || course.university.toLowerCase().replace(/\s+/g, '') === selectedUniversity.toLowerCase().replace(/\s+/g, '');
    const matchesCategory =
      !selectedCategory || course.program.toLowerCase().replace(/\s+/g, '') === selectedCategory.toLowerCase().replace(/\s+/g, '');

    const matchesSemester =
      !selectedSemester ||
      splitSemesters(course.semester).includes(
        normalizeSemester(selectedSemester)
      ); 

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="container mx-auto px-4 py-12 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#5C67E5] to-[#4f5ed7] flex items-center gap-3">
          <BookOpen className="w-10 h-10" />
          Available Courses
        </h1>
        <div className="w-full md:w-auto flex flex-col lg:flex-row gap-4 items-end lg:ml-auto">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <Select
              onValueChange={setSelectedUniversity}
              value={selectedUniversity}>
              <SelectTrigger className="w-full sm:w-[180px] shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2">
                <School className="w-4 h-4" />
                <SelectValue placeholder="Select University" />
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
              <SelectTrigger className="w-full sm:w-[180px] shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2">
                <SelectValue placeholder="Select Program" />
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
              <SelectTrigger className="w-full sm:w-[180px] shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
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

          <div className="relative w-full sm:w-[250px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="search"
              placeholder="Search courses..."
              className="pl-10 w-full shadow-sm hover:shadow-md transition-shadow duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#5C67E5]"></div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
          <Search className="w-16 h-16 text-gray-400" />
          <p className="text-2xl text-gray-500 font-light">No courses found</p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          initial="hidden"
          animate="show">
          {filteredCourses.map((course) => (
            <MotionCard
              key={course.title}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.03, translateY: -5 }}
              whileTap={{ scale: 0.98 }}
              className="backdrop-blur-sm bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FileVideo className="w-5 h-5 text-[#5C67E5]" />
                  {course.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 flex items-center gap-2">
                  <School className="w-4 h-4" />
                  {course.university} • {course.program} • Semester {course.semester}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {course.videoUrl ? (
                  <video
                    className="w-full h-48 object-cover mb-6 rounded-lg shadow-md"
                    autoPlay
                    loop
                    muted>
                    <source src={course.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    className="w-full h-48 object-cover mb-6 rounded-lg shadow-md"
                    src={course.imageUrl}
                    alt=""
                  />
                )}
                <p className="text-gray-700 leading-relaxed">{course.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-4 border-t">
                {course.price === 0 ? (
                  <span className="text-lg font-bold text-green-500">Free</span>
                ) : (
                  <span className="text-lg font-bold text-[#5C67E5]">Rs. {course.price}</span>
                )}
                {course.gdlink ? (
                  <Link href={`${course.gdlink}`}>
                    <Button className="bg-[#5C67E5] text-white hover:bg-[#4f5ed7] shadow-md hover:shadow-lg transition-all duration-300 px-6 flex items-center gap-2">
                      Drive Course
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/courses/${course.id}`}>
                    <Button className="bg-[#5C67E5] text-white hover:bg-[#4f5ed7] shadow-md hover:shadow-lg transition-all duration-300 px-6 flex items-center gap-2">
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
