import React from 'react';
import { Bell, Search } from 'lucide-react';
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

const StudentHeader = ({
  userName,
  userGrade,
  avatarUrl,
  notificationCount = 0
}) => {
  return (
    <header className="flex items-center justify-between px-8 py-6 animate-fade-in">
      <div className="flex-1">
        <h1 className="text-2xl font-display font-medium text-foreground">
          Welcome, <span className="text-blue-600 font-semibold">{userName}</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          <Badge variant="outline" className="mr-2 font-normal">{userGrade}</Badge>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search courses, assignments..." 
            className="pl-10 bg-secondary/50 border-none" 
          />
        </div>
        
        <div className="relative">
          <button className="relative p-2 rounded-full hover:bg-secondary transition-all-smooth">
            <Bell className="h-5 w-5 text-muted-foreground" />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center font-medium">
                {notificationCount}
              </span>
            )}
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-gray-200">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-blue-100 text-blue-700">
              {userName.split(' ').map(name => name[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default StudentHeader; 