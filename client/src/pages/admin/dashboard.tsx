import { useSubjects, useActivities, useStudents, useAnnouncements } from "@/hooks/use-store";
import { LayoutShell } from "@/components/layout-shell";
import { StatCard } from "@/components/stat-card";
import { Users, BookOpen, FileCheck, Megaphone, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export default function AdminDashboard() {
  const { data: students, isLoading: sLoading } = useStudents();
  const { data: subjects, isLoading: subLoading } = useSubjects();
  const { data: activities, isLoading: aLoading } = useActivities();
  const { data: announcements, isLoading: annLoading } = useAnnouncements();

  const isLoading = sLoading || subLoading || aLoading || annLoading;

  if (isLoading) {
    return (
      <LayoutShell>
        <div className="flex h-[80vh] items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </LayoutShell>
    );
  }

  const recentAnnouncements = announcements?.slice(-3).reverse() || [];

  return (
    <LayoutShell>
      <div>
        <h2 className="text-3xl font-display font-bold text-slate-800">Admin Dashboard</h2>
        <p className="text-slate-500 mt-2">Welcome back, here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Students" 
          value={students?.length || 0} 
          icon={Users} 
          color="text-blue-600"
          bgClass="bg-blue-50"
        />
        <StatCard 
          label="Active Subjects" 
          value={subjects?.length || 0} 
          icon={BookOpen}
          color="text-indigo-600"
          bgClass="bg-indigo-50"
        />
        <StatCard 
          label="Total Activities" 
          value={activities?.length || 0} 
          icon={FileCheck}
          color="text-emerald-600"
          bgClass="bg-emerald-50"
        />
        <StatCard 
          label="Announcements" 
          value={announcements?.length || 0} 
          icon={Megaphone}
          color="text-orange-600"
          bgClass="bg-orange-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-lg shadow-slate-200/50">
            <CardHeader>
              <CardTitle className="font-display">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {/* Timeline simulation */}
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-50 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-bold text-slate-900">New Assignment Created</div>
                        <time className="font-caveat font-medium text-indigo-500 text-xs">Today</time>
                      </div>
                      <div className="text-slate-500 text-sm">You added a new quiz for Introduction to Computer Science.</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-0 shadow-lg shadow-slate-200/50 h-full">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-orange-500" />
                Recent Announcements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentAnnouncements.length === 0 ? (
                <p className="text-slate-400 text-sm italic">No announcements posted yet.</p>
              ) : (
                <div className="space-y-6">
                  {recentAnnouncements.map((ann) => (
                    <div key={ann.id} className="relative pl-6 border-l-2 border-slate-100 pb-2">
                      <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-orange-400 ring-4 ring-white" />
                      <h4 className="font-semibold text-sm text-slate-800">{ann.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{ann.createdAt}</p>
                      <p className="text-sm text-slate-500 mt-2 line-clamp-2">{ann.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutShell>
  );
}
