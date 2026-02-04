import { LayoutShell } from "@/components/layout-shell";
import { useActivities, useSubjects } from "@/hooks/use-store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function StudentActivities() {
  const { data: activities } = useActivities();
  const { data: subjects } = useSubjects();

  const getSubjectName = (id: number) => subjects?.find(s => s.id === id)?.name || "Unknown";

  return (
    <LayoutShell>
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-slate-800">Assignments & Exams</h2>
        <p className="text-slate-500 mt-1">Track your pending tasks and deadlines</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead className="text-right">Points</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities?.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>
                  <span className="w-2 h-2 rounded-full bg-orange-500 block" title="Pending" />
                </TableCell>
                <TableCell className="font-medium">{activity.title}</TableCell>
                <TableCell className="text-slate-500">{getSubjectName(activity.subjectId)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                    ${activity.type === 'Exam' ? 'bg-red-100 text-red-700' : 
                      activity.type === 'Quiz' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-blue-100 text-blue-700'}`}>
                    {activity.type}
                  </span>
                </TableCell>
                <TableCell>{activity.deadline}</TableCell>
                <TableCell className="text-right">{activity.points}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline">Submit</Button>
                </TableCell>
              </TableRow>
            ))}
            {activities?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                  No activities assigned yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </LayoutShell>
  );
}
