import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";

// Pages
import LoginPage from "@/pages/login";

// Admin Pages
import AdminDashboard from "@/pages/admin/dashboard";
import AdminSubjects from "@/pages/admin/subjects";
import AdminActivities from "@/pages/admin/activities";
import AdminStudents from "@/pages/admin/students";
import AdminAnnouncements from "@/pages/admin/announcements";
import AdminMaterials from "@/pages/admin/materials";

// Student Pages
import StudentDashboard from "@/pages/student/dashboard";
import StudentSubjects from "@/pages/student/subjects";
import StudentActivities from "@/pages/student/activities";
import StudentProfile from "@/pages/student/profile";
import StudentAnnouncementsPage from "@/pages/student/announcements";
import StudentMaterials from "@/pages/student/materials";

// Student Announcements Component
function StudentAnnouncements() {
  return <StudentAnnouncementsPage />;
}

// Protected Route Wrapper
function ProtectedRoute({ 
  component: Component, 
  allowedRoles 
}: { 
  component: React.ComponentType<any>, 
  allowedRoles: ('admin' | 'student')[] 
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user) return <Redirect to="/login" />;
  
  if (!allowedRoles.includes(user.role as any)) {
    return <Redirect to={user.role === 'admin' ? '/dashboard' : '/student/dashboard'} />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      
      {/* Admin Routes */}
      <Route path="/dashboard">
        <ProtectedRoute component={AdminDashboard} allowedRoles={['admin']} />
      </Route>
      <Route path="/subjects">
        <ProtectedRoute component={AdminSubjects} allowedRoles={['admin']} />
      </Route>
      <Route path="/materials">
        <ProtectedRoute component={AdminMaterials} allowedRoles={['admin']} />
      </Route>
      <Route path="/activities">
        <ProtectedRoute component={AdminActivities} allowedRoles={['admin']} />
      </Route>
      <Route path="/students">
        <ProtectedRoute component={AdminStudents} allowedRoles={['admin']} />
      </Route>
      <Route path="/announcements">
        <ProtectedRoute component={AdminAnnouncements} allowedRoles={['admin']} />
      </Route>

      {/* Student Routes */}
      <Route path="/student/dashboard">
        <ProtectedRoute component={StudentDashboard} allowedRoles={['student']} />
      </Route>
      <Route path="/student/subjects">
        <ProtectedRoute component={StudentSubjects} allowedRoles={['student']} />
      </Route>
      <Route path="/student/materials">
        <ProtectedRoute component={StudentMaterials} allowedRoles={['student']} />
      </Route>
      <Route path="/student/activities">
        <ProtectedRoute component={StudentActivities} allowedRoles={['student']} />
      </Route>
      <Route path="/student/profile">
        <ProtectedRoute component={StudentProfile} allowedRoles={['student']} />
      </Route>
      <Route path="/student/announcements">
        <ProtectedRoute component={StudentAnnouncements} allowedRoles={['student']} />
      </Route>

      {/* Default Redirect */}
      <Route path="/">
        <Redirect to="/login" />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
