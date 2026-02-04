import { LayoutShell } from "@/components/layout-shell";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function StudentProfile() {
  const { user } = useAuth();

  return (
    <LayoutShell>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-display font-bold text-slate-800 mb-8">My Profile</h2>
        
        <Card className="overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600" />
          <div className="px-8 pb-8">
            <div className="relative -mt-16 mb-6">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarFallback className="text-3xl bg-slate-200 text-slate-500">
                  {user?.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{user?.name}</h3>
                <p className="text-slate-500">@{user?.username}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-400">Student ID</label>
                  <p className="text-slate-700 font-mono bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                    {user?.studentId || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-400">Email Address</label>
                  <p className="text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                    {user?.email || "No email provided"}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-400">Section / Year</label>
                  <p className="text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                    {user?.section || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-400">Role</label>
                  <p className="text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 capitalize">
                    {user?.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </LayoutShell>
  );
}
