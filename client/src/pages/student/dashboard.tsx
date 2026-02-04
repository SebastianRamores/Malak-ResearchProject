import { LayoutShell } from "@/components/layout-shell";
import { useAuth } from "@/hooks/use-auth";
import { useSubjects, useActivities, useAnnouncements } from "@/hooks/use-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, AlertCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { data: subjects } = useSubjects();
  const { data: activities } = useActivities();
  const { data: announcements } = useAnnouncements();

  // For this prototype, assume student is enrolled in ALL subjects
  const mySubjects = subjects || [];
  const pendingActivities = activities?.slice(0, 5) || []; // Simulating pending
  const latestAnnouncement = announcements?.[announcements.length - 1];

  return (
    <LayoutShell>
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 mb-8">
        <h2 className="text-3xl font-display font-bold">Hello, {user?.name.split(' ')[0]}! 👋</h2>
        <p className="mt-2 text-indigo-100 max-w-xl">
          You have {pendingActivities.length} pending assignments due this week. Keep up the great work!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-800">My Subjects</h3>
              <Link href="/student/subjects">
                <Button variant="ghost" className="text-primary underline">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mySubjects.slice(0, 4).map(sub => (
                <Card key={sub.id} className="hover:border-primary/50 transition-colors cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-600">{sub.code}</span>
                    </div>
                    <CardTitle className="line-clamp-1 text-base">{sub.name}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Upcoming Deadlines</h3>
            <div className="space-y-4">
              {pendingActivities.map(act => (
                <div key={act.id} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-2 h-12 rounded-full ${act.type === 'Exam' ? 'bg-red-500' : 'bg-green-500'}`} />
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800">{act.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span className="bg-slate-100 px-2 py-0.5 rounded">{act.type}</span>
                      <span>•</span>
                      <span>Due {act.deadline}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">View</Button>
                </div>
              ))}
              {pendingActivities.length === 0 && (
                <p className="text-slate-500 italic">No pending assignments! 🎉</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {latestAnnouncement && (
            <Card className="bg-orange-50 border-orange-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800 text-lg">
                  <AlertCircle className="w-5 h-5" />
                  Notice Board
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h4 className="font-bold text-slate-800">{latestAnnouncement.title}</h4>
                <p className="text-sm text-slate-600 mt-2 line-clamp-3">{latestAnnouncement.content}</p>
                <div className="mt-4 pt-4 border-t border-orange-200 flex items-center gap-2 text-xs text-orange-700 font-medium">
                  <Calendar className="w-3 h-3" />
                  {latestAnnouncement.createdAt}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-slate-900 text-white border-0">
            <CardHeader>
              <CardTitle>Student Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Enrolled Subjects</span>
                <span className="font-bold text-xl">{mySubjects.length}</span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Pending Tasks</span>
                <span className="font-bold text-xl">{pendingActivities.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutShell>
  );
}
