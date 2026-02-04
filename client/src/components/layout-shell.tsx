import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  BookOpen, 
  FileCheck, 
  Users, 
  Megaphone, 
  LogOut, 
  UserCircle,
  Menu,
  X,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LayoutShellProps {
  children: React.ReactNode;
}

export function LayoutShell({ children }: LayoutShellProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = user?.role === 'admin';

  const adminLinks = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/subjects", icon: BookOpen, label: "Subjects" },
    { href: "/materials", icon: FileText, label: "Materials" },
    { href: "/activities", icon: FileCheck, label: "Activities" },
    { href: "/students", icon: Users, label: "Students" },
    { href: "/announcements", icon: Megaphone, label: "Announcements" },
  ];

  const studentLinks = [
    { href: "/student/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/student/subjects", icon: BookOpen, label: "My Subjects" },
    { href: "/student/materials", icon: FileText, label: "Materials" },
    { href: "/student/activities", icon: FileCheck, label: "Assignments" },
    { href: "/student/announcements", icon: Megaphone, label: "Announcements" },
    { href: "/student/profile", icon: UserCircle, label: "My Profile" },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:transform-none shadow-2xl",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-white/10">
            <h1 className="text-2xl font-bold font-display bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              LMS Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">
              {isAdmin ? "Teacher / Admin" : "Student Portal"}
            </p>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {links.map((link) => {
              const isActive = location === link.href;
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href} className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/25" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )} onClick={() => setMobileMenuOpen(false)}>
                  <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-500 group-hover:text-white")} />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">@{user?.username}</p>
              </div>
            </div>
            <Button 
              variant="destructive" 
              className="w-full justify-start gap-2" 
              onClick={logout}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm z-30">
          <h1 className="font-bold text-lg text-slate-800">LMS Portal</h1>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8 relative">
          <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
