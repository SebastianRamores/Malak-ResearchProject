import { useState } from "react";
import { LayoutShell } from "@/components/layout-shell";
import { useActivities, useCreateActivity, useDeleteActivity, useSubjects } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Loader2, FileCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InsertActivitySchema } from "@/lib/types";
import { z } from "zod";
import { format } from "date-fns";

// Schema adjustment for form: points should be number, subjectId should be number
const formSchema = InsertActivitySchema.extend({
  points: z.coerce.number().min(1),
  subjectId: z.coerce.number(),
});

export default function ActivitiesPage() {
  const { data: activities, isLoading: actLoading } = useActivities();
  const { data: subjects, isLoading: subLoading } = useSubjects();
  const createActivity = useCreateActivity();
  const deleteActivity = useDeleteActivity();
  const [open, setOpen] = useState(false);
  const [filterSubject, setFilterSubject] = useState<string>("all");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "Assignment",
      deadline: "",
      points: 100,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createActivity.mutateAsync(values);
    form.reset();
    setOpen(false);
  };

  const getSubjectName = (id: number) => subjects?.find(s => s.id === id)?.name || "Unknown";

  const filteredActivities = filterSubject === "all" 
    ? activities 
    : activities?.filter(a => a.subjectId.toString() === filterSubject);

  const isLoading = actLoading || subLoading;

  return (
    <LayoutShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-800">Activity Management</h2>
          <p className="text-slate-500 mt-1">Assign homework, quizzes, and exams</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
              <Plus className="w-4 h-4 mr-2" />
              Create Activity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Activity</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="subjectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subjects?.map(s => (
                            <SelectItem key={s.id} value={s.id.toString()}>{s.name} ({s.code})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Midterm Exam" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Assignment">Assignment</SelectItem>
                            <SelectItem value="Quiz">Quiz</SelectItem>
                            <SelectItem value="Exam">Exam</SelectItem>
                            <SelectItem value="Project">Project</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="points"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Points</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deadline</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={createActivity.isPending}>
                  {createActivity.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Assign Activity"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex justify-end mb-4">
          <Select value={filterSubject} onValueChange={setFilterSubject}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects?.map(s => (
                <SelectItem key={s.id} value={s.id.toString()}>{s.code}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>
        ) : filteredActivities?.length === 0 ? (
          <div className="text-center py-12">
            <FileCheck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No activities found.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activity</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead className="text-right">Points</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities?.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.title}</TableCell>
                  <TableCell>{getSubjectName(activity.subjectId)}</TableCell>
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
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        if (confirm('Delete this activity?')) deleteActivity.mutate(activity.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </LayoutShell>
  );
}
