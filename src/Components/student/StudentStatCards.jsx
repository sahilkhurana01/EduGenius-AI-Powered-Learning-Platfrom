import React from 'react';
import { BookOpen, Clock, GraduationCap, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { cn } from '../../lib/utils';

const StatCard = ({ title, value, description, icon: Icon, iconColor, iconBg }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn("p-2 rounded-full", iconBg)}>
          <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

const StudentStatCards = ({ stats }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <StatCard
        title="Active Courses"
        value={stats.courses}
        description="Enrolled courses"
        icon={BookOpen}
        iconColor="text-blue-500"
        iconBg="bg-blue-100"
      />
      <StatCard
        title="Attendance Rate"
        value={`${stats.attendance}%`}
        description="Last 30 days"
        icon={Clock}
        iconColor="text-green-500"
        iconBg="bg-green-100"
      />
      <StatCard
        title="Completion Rate"
        value={`${stats.completion}%`}
        description="Across all courses"
        icon={GraduationCap}
        iconColor="text-purple-500"
        iconBg="bg-purple-100"
      />
      <StatCard
        title="Average Grade"
        value={stats.avgGrade}
        description="Current semester"
        icon={Award}
        iconColor="text-amber-500"
        iconBg="bg-amber-100"
      />
    </div>
  );
};

export default StudentStatCards; 