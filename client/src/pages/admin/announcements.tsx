import { useState } from "react";
import { LayoutShell } from "@/components/layout-shell";
import { useAnnouncements, useCreateAnnouncement, useDeleteAnnouncement } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Plus, Trash2, Megaphone, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InsertAnnouncementSchema } from "@/lib/types";
import { z } from "zod";
import { format } from "date-fns";

const formSchema = InsertAnnouncementSchema;

export default function AnnouncementsPage() {
  const { data: announcements, isLoading } = useAnnouncements();
  const createAnnouncement = useCreateAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof InsertAnnouncementSchema>>({
    resolver: zodResolver(InsertAnnouncementSchema),
    defaultValues: {
      title: "",
      content: "",
      createdAt: format(new Date(), 'yyyy-MM-dd'),
    },
  });

  const onSubmit = async (values: z.infer<typeof InsertAnnouncementSchema>) => {
    await createAnnouncement.mutateAsync(values);
    form.reset({
      title: "",
      content: "",
      createdAt: format(new Date(), 'yyyy-MM-dd'),
    });
    setOpen(false);
  };

  return (
    <LayoutShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-800">Announcements</h2>
          <p className="text-slate-500 mt-1">Broadcast updates to all students</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25">
              <Plus className="w-4 h-4 mr-2" />
              Post Update
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Announcement</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Headline</FormLabel>
                      <FormControl><Input placeholder="Important update..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl><Textarea placeholder="Type your message here..." className="min-h-[100px]" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">Post Announcement</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {announcements?.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
            <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No announcements posted.</p>
          </div>
        )}
        
        {announcements?.map((ann) => (
          <Card key={ann.id} className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-all">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{ann.title}</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-slate-400 hover:text-red-500"
                  onClick={() => deleteAnnouncement.mutate(ann.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 whitespace-pre-wrap">{ann.content}</p>
            </CardContent>
            <CardFooter className="text-xs text-slate-400 flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              Posted on {ann.createdAt}
            </CardFooter>
          </Card>
        ))}
      </div>
    </LayoutShell>
  );
}
