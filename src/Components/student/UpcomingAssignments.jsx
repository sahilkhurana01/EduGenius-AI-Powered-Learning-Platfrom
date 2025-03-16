import React from 'react';
import { Calendar, Clock, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { cn } from '../../lib/utils';

const assignments = [
  {
    id: 1,
    title: "Mathematics Problem Set",
    course: "Mathematics",
    dueDate: "2023-06-15T23:59:59",
    status: "pending",
    priority: "high"
  },
  {
    id: 2,
    title: "Science Lab Report",
    course: "Science",
    dueDate: "2023-06-18T23:59:59",
    status: "pending",
    priority: "medium"
  },
  {
    id: 3,
    title: "History Essay",
    course: "History",
    dueDate: "2023-06-20T23:59:59",
    status: "pending",
    priority: "low"
  }
];

const priorityConfig = {
  high: {
    color: "text-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    label: "High Priority"
  },
  medium: {
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    label: "Medium Priority"
  },
  low: {
    color: "text-green-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    label: "Low Priority"
  }
};

const formatDueDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return "Due today";
  } else if (diffDays === 1) {
    return "Due tomorrow";
  } else if (diffDays > 1) {
    return `Due in ${diffDays} days`;
  } else {
    return "Overdue";
  }
};

const UpcomingAssignments = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-edugenius-500" />
          Upcoming Assignments
        </CardTitle>
        <CardDescription>Your pending assignments and due dates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assignments.map((assignment) => {
            const priority = priorityConfig[assignment.priority];
            
            return (
              <div 
                key={assignment.id} 
                className={cn(
                  "p-3 rounded-lg border flex flex-col space-y-2",
                  priority.borderColor,
                  priority.bgColor
                )}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{assignment.title}</h3>
                  <Badge variant="outline" className={priority.color}>
                    {priority.label}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Course: {assignment.course}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDueDate(assignment.dueDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{new Date(assignment.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            );
          })}
          
          <button className="w-full text-center text-sm font-medium text-edugenius-600 hover:text-edugenius-700 py-2">
            View All Assignments
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingAssignments; 