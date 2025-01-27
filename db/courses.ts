import db from '@/db';

export async function getCourses() {
  const courses = await db.course.findMany();
  return courses;
}