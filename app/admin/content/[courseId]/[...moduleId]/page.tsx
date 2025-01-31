"use client";
import { AddContent } from "@/components/admin/AddContent";
import { AdminCourseContent } from "@/components/admin/AdminCourseContent";

export default async function UpdateCourseContent({
  params,
}: {
  params: { moduleId: string[]; courseId: string };
}) {
  const courseId = params.courseId;
  const rest = params.moduleId;
  const course = await fetch('/api/admin/course/byId', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      courseId,
    }),
  }).then((res) => res.json());
  
  const parentId = rest[rest.length - 1];

  const fullCourseContent = await fetch('/api/content', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      courseId: parentId ? undefined : courseId,
      parentId,
    }),
  }).then((res) => res.json());

  const contentId = rest[rest.length - 1];
  const courseContent = await fetch(`/api/content/byId`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contentId,
    }),
  }).then((res) => res.json());
  
  if (!courseContent) {
    return (
      <div className="mx-auto max-w-screen-xl justify-between p-4 text-white">
        <h1 className="text-2xl font-bold">Content not found</h1>
      </div>
    );
  }
  const contentType = courseContent.type;

  if (contentType === "video") {
    return (
    //   <div className="mx-auto max-w-screen-xl justify-between p-4 text-white">
    //     {/* @ts-ignore */}
    //     <UpdateVideoClient content={courseContent.value} />
    //   </div>
    <></>
    );
  }

  if (contentType === "pdf") {
    return (
      <div className="text-blacke mx-auto max-w-screen-xl justify-between p-4 dark:text-white">
        {/* <NotionRenderer id={courseContent[0]?.id} /> */}
        Notion doc
      </div>
    );
  }

  return (
    <main className="wrapper flex max-w-screen-xl m-10 flex-col gap-14">
      <div className="flex w-full flex-col justify-between gap-2 rounded-lg border-2 bg-primary/5 p-4">
        <h1 className="text-3xl font-bold md:text-4xl">Content</h1>
        <p className="text-xl capitalize">{course?.title}</p>
      </div>

      <AddContent
        rest={rest}
        courseTitle={course?.title}
        courseId={courseId}
        parentContentId={rest[rest.length - 1]}
      />

      <AdminCourseContent
        rest={rest}
        // @ts-ignore
        courseContent={fullCourseContent?.map((x: any) => ({
          title: x?.title || "",
          image: x?.thumbnail || "",
          id: x?.id || 0,
          createdAt: x?.createdAt,
        }))}
        courseId={courseId}
      />
    </main>
  );
}
