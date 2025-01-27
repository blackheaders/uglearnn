'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from './ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { MessageCircle, PlayCircle } from "lucide-react";

type Course = {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    openToEveryone?: boolean;
    totalVideos?: number;
    totalVideosWatched?: number;
  };

export const CourseCard = ({
  course,
  onClick,
}: {
  course: Course;
  onClick: () => void;
}) => {
  const router = useRouter();
  const imageUrl = course.imageUrl ? course.imageUrl : 'banner_placeholder.png';

  return (
    <Card className="w-full max-w-sm overflow-hidden transition-all hover:shadow-lg cursor-pointer" onClick={onClick}>
      <div className="relative aspect-video overflow-hidden">
        <img
          alt={course.title}
          className="object-cover w-full h-full transition-transform hover:scale-105"
          height="200"
          src={imageUrl}
          style={{
            aspectRatio: "300/200",
            objectFit: "cover",
            filter: "brightness(1.2) contrast(1.1)",
          }}
          width="300"
        />        
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-primary mb-2 line-clamp-2">
          {course.title}
        </h3>
        <div className="flex space-x-2">
          <Button className="flex-1" variant="default" onClick={onClick}>
            <PlayCircle className="w-4 h-4 mr-2" />
            View Course
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
