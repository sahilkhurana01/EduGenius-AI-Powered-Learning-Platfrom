import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { cn } from '../../lib/utils';

const courses = [
  {
    id: 1,
    name: "Mathematics",
    progress: 85,
    color: "bg-blue-500",
    textColor: "text-blue-500",
    bgColor: "bg-blue-100",
    lastActivity: "Completed Quiz 7 yesterday"
  },
  {
    id: 2,
    name: "Science",
    progress: 72,
    color: "bg-green-500",
    textColor: "text-green-500",
    bgColor: "bg-green-100",
    lastActivity: "Watched 'Cell Division' video 2 days ago"
  },
  {
    id: 3,
    name: "History",
    progress: 64,
    color: "bg-amber-500",
    textColor: "text-amber-500",
    bgColor: "bg-amber-100",
    lastActivity: "Submitted essay on World War II 3 days ago"
  },
  {
    id: 4,
    name: "English Literature",
    progress: 91,
    color: "bg-purple-500",
    textColor: "text-purple-500",
    bgColor: "bg-purple-100",
    lastActivity: "Completed 'Macbeth' analysis today"
  }
];

const LearningProgress = () => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Learning Progress</CardTitle>
        <CardDescription>Track your progress across all subjects</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {courses.map((course) => (
            <div key={course.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-full", course.color)} />
                  <span className="font-medium">{course.name}</span>
                </div>
                <span className={cn("font-semibold text-sm", course.textColor)}>
                  {course.progress}%
                </span>
              </div>
              <Progress value={course.progress} className="h-2" indicatorClassName={course.color} />
              <p className="text-xs text-muted-foreground">{course.lastActivity}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningProgress; 