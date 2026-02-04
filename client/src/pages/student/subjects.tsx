import { LayoutShell } from "@/components/layout-shell";
import { useSubjects } from "@/hooks/use-store";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function StudentSubjects() {
  const { data: subjects } = useSubjects();

  return (
    <LayoutShell>
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-slate-800">My Subjects</h2>
        <p className="text-slate-500 mt-1">Courses you are currently enrolled in</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects?.map((subject) => (
          <Card key={subject.id} className="group hover:shadow-xl transition-all duration-300 border-slate-100 overflow-hidden cursor-pointer">
            <div className="h-32 bg-slate-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
              <BookOpen className="w-12 h-12 text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded uppercase tracking-wider group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {subject.code}
                </span>
              </div>
              <CardTitle className="line-clamp-1 group-hover:text-blue-600 transition-colors">{subject.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {subject.description || "No description provided."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-slate-400 font-medium">
                Click to view details & assignments
              </div>
            </CardContent>
          </Card>
        ))}
        {subjects?.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No subjects enrolled.
          </div>
        )}
      </div>
    </LayoutShell>
  );
}
