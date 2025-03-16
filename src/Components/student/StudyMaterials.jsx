import React from 'react';
import { BookOpen, FileText, Video, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { cn } from '../../lib/utils';

const materials = [
  {
    id: 1,
    title: "Algebra Fundamentals",
    type: "document",
    course: "Mathematics",
    size: "2.4 MB",
    date: "2023-06-10"
  },
  {
    id: 2,
    title: "Cell Division Video Lecture",
    type: "video",
    course: "Science",
    size: "45 MB",
    date: "2023-06-08"
  },
  {
    id: 3,
    title: "World War II Timeline",
    type: "document",
    course: "History",
    size: "1.8 MB",
    date: "2023-06-05"
  },
  {
    id: 4,
    title: "Shakespeare's Macbeth Analysis",
    type: "document",
    course: "English Literature",
    size: "3.2 MB",
    date: "2023-06-12"
  }
];

const getFileIcon = (type) => {
  switch (type) {
    case 'document':
      return <FileText className="h-4 w-4 text-blue-500" />;
    case 'video':
      return <Video className="h-4 w-4 text-red-500" />;
    default:
      return <FileText className="h-4 w-4 text-gray-500" />;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const StudyMaterials = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-edugenius-500" />
          Study Materials
        </CardTitle>
        <CardDescription>Recently added learning resources</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {materials.map((material) => (
            <div 
              key={material.id} 
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-secondary">
                  {getFileIcon(material.type)}
                </div>
                <div>
                  <h3 className="font-medium text-sm">{material.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {material.course} • {material.size}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground">
                  {formatDate(material.date)}
                </span>
                <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          
          <button className="w-full text-center text-sm font-medium text-edugenius-600 hover:text-edugenius-700 py-2">
            Browse All Materials
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyMaterials; 