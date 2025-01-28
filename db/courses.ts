import db from '@/db';

export async function getCourses() {
  const courses = await db.course.findMany();
  return courses;
}

export async function getCourse(courseId: string) {
  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
  });
  return course;
}