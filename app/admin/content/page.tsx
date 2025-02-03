import React from 'react';
import db from '@/db';
//@ts-ignore
import { SelectCourse } from '@/components/admin/SelectCourse';
import { Cuboid } from 'lucide-react';
import Link from 'next/link';

async function getCourses() {
  const courses = db.course.findMany();
  return courses;
}

export default async function CourseContent() {
  const courses = await getCourses();
  return (
    <div className="mx-auto max-w-screen-xl cursor-pointer justify-between p-4">
        <section className="my-4 flex items-center gap-2 rounded-lg border-2 bg-primary/5 p-4">
        <Cuboid size={18} />
        <Link href="/admin/add-course" className="text-lg font-semibold">
          <h2 className="text-md font-bold">Add Course</h2>
        </Link>
      </section>
      {/* @ts-ignore */}
      <SelectCourse courses={courses} />
    </div>
  );
}
