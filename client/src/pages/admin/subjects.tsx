import { useState } from "react";
import { LayoutShell } from "@/components/layout-shell";
import { useSubjects, useCreateSubject, useDeleteSubject } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Trash2, BookOpen, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InsertSubjectSchema } from "@/lib/types";
import { z } from "zod";

export default function SubjectsPage() {
  const { data: subjects, isLoading } = useSubjects();
  const createSubject = useCreateSubject();
  const deleteSubject = useDeleteSubject();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof InsertSubjectSchema>>({
    resolver: zodResolver(InsertSubjectSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof InsertSubjectSchema>) => {
    await createSubject.mutateAsync(values);
    form.reset();
    setOpen(false);
  };

  const filteredSubjects = subjects?.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <LayoutShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-800">Subject Management</h2>
          <p className="text-slate-500 mt-1">Create and manage curriculum subjects</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
              <Plus className="w-4 h-4 mr-2" />
              Add New Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Subject</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject Code</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. CS101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Introduction to Computer Science" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Course description..." 
                          {...field} 
                          value={field.value || ''} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={createSubject.isPending}>
                  {createSubject.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Subject"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input 
          className="pl-10 max-w-sm bg-white" 
          placeholder="Search subjects..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSubjects?.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No subjects found. Create your first one!</p>
            </div>
          ) : (
            filteredSubjects?.map((subject) => (
              <Card key={subject.id} className="group hover:shadow-xl transition-all duration-300 border-slate-100 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded uppercase tracking-wider">
                      {subject.code}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50"
                      onClick={() => {
                        if (confirm('Delete this subject and all its activities?')) {
                          deleteSubject.mutate(subject.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardTitle className="mt-2 line-clamp-1" title={subject.name}>{subject.name}</CardTitle>
                  <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                    {subject.description || "No description provided."}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      )}
    </LayoutShell>
  );
}
