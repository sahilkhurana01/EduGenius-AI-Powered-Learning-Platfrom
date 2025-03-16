import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter,
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger
} from "../ui/sidebar";
import { 
  GraduationCap, 
  BookOpen, 
  CalendarDays, 
  MessageSquare, 
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  FileText,
  Clock
} from 'lucide-react';
import { cn } from '../../lib/utils';

const mainNavItems = [
  { title: "Dashboard", icon: BarChart3, url: "#dashboard" },
  { title: "My Courses", icon: GraduationCap, url: "#courses" },
  { title: "Assignments", icon: FileText, url: "#assignments", badge: 3 },
  { title: "Schedule", icon: Clock, url: "#schedule" },
  { title: "Resources", icon: BookOpen, url: "#resources", badge: "New" },
  { title: "Calendar", icon: CalendarDays, url: "#calendar" },
  { title: "Messages", icon: MessageSquare, url: "#messages", badge: 2 },
];

const supportNavItems = [
  { title: "Settings", icon: Settings, url: "#settings" },
  { title: "Help & Support", icon: HelpCircle, url: "#help" },
];

const StudentSideNav = () => {
  const [activeItem, setActiveItem] = React.useState("#dashboard");

  return (
    <Sidebar className="border-r border-gray-200 animate-fade-in">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <span className="text-white font-display font-bold text-lg">E</span>
          </div>
          <span className="font-display font-semibold text-lg text-foreground">EduGenius</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-2">
        <SidebarMenu>
          <SidebarGroup>
            <SidebarGroupContent>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title} className="mb-1">
                  <SidebarMenuButton
                    onClick={() => setActiveItem(item.url)}
                    className={cn(
                      activeItem === item.url ? "bg-blue-50 text-blue-700 hover:bg-blue-100" : "hover:bg-secondary"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 mr-3",
                      activeItem === item.url ? "text-blue-600" : "text-muted-foreground"
                    )} />
                    <span>{item.title}</span>
                    {item.badge && (
                      <span className={cn(
                        "ml-auto flex h-5 min-w-5 items-center justify-center rounded-full text-xs font-medium",
                        typeof item.badge === "string" 
                          ? "bg-blue-100 text-blue-700 px-1.5" 
                          : "bg-blue-500 text-white"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel>Support</SidebarGroupLabel>
            <SidebarGroupContent>
              {supportNavItems.map((item) => (
                <SidebarMenuItem key={item.title} className="mb-1">
                  <SidebarMenuButton
                    onClick={() => setActiveItem(item.url)}
                    className={cn(
                      activeItem === item.url ? "bg-blue-50 text-blue-700 hover:bg-blue-100" : "hover:bg-secondary"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 mr-3",
                      activeItem === item.url ? "text-blue-600" : "text-muted-foreground"
                    )} />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="p-4 mt-auto">
        <SidebarMenuButton className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
          <LogOut className="h-5 w-5 mr-3" />
          <span>Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};

export default StudentSideNav; 