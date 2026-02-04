import { LayoutShell } from "@/components/layout-shell";
import { useAnnouncements } from "@/hooks/use-store";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Calendar, Megaphone } from "lucide-react";

export default function StudentAnnouncementsPage() {
  const { data: announcements } = useAnnouncements();

  return (
    <LayoutShell>
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-slate-800">Announcements</h2>
        <p className="text-slate-500 mt-1">Updates and news from your teachers</p>
      </div>

      <div className="space-y-6 max-w-3xl">
        {announcements?.length === 0 && (
          <div className="py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-200">
            No announcements found.
          </div>
        )}

        {announcements?.slice().reverse().map((ann) => (
          <Card key={ann.id} className="border-l-4 border-l-blue-500 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-start gap-3 text-lg">
                <Megaphone className="w-5 h-5 text-blue-500 mt-1 shrink-0" />
                {ann.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{ann.content}</p>
            </CardContent>
            <CardFooter className="pt-0 text-xs text-slate-400 flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              Posted on {ann.createdAt}
            </CardFooter>
          </Card>
        ))}
      </div>
    </LayoutShell>
  );
}
