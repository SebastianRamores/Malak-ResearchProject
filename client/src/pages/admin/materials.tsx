import { useState, useEffect } from "react";
import { LayoutShell } from "@/components/layout-shell";
import { useMaterials, useCreateMaterial, useDeleteMaterial, useSubjects } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Loader2, BookOpen, Link as LinkIcon, FileText, Video, File, Book } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InsertMaterialSchema } from "@/lib/types";
import { z } from "zod";

const formSchema = InsertMaterialSchema.extend({
  subjectId: z.coerce.number(),
  url: z.string().optional().or(z.string().url().optional()),
});

export default function MaterialsPage() {
  const { data: materials, isLoading: matLoading } = useMaterials();
  const { data: subjects, isLoading: subLoading } = useSubjects();
  const createMaterial = useCreateMaterial();
  const deleteMaterial = useDeleteMaterial();
  const [open, setOpen] = useState(false);
  const [filterSubject, setFilterSubject] = useState<string>("all");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "Link",
      url: "",
      pages: [""],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "pages" as any
  });

  const materialType = form.watch("type");

  useEffect(() => {
    if (materialType === 'Reading' && fields.length === 0) {
      append("");
    }
  }, [materialType, fields.length, append]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createMaterial.mutateAsync(values as any);
    form.reset();
    setOpen(false);
  };

  const getSubjectName = (id: number) => subjects?.find(s => s.id === id)?.name || "Unknown";

  const getIcon = (type: string) => {
    switch(type) {
      case 'Link': return <LinkIcon className="w-4 h-4" />;
      case 'PDF': return <FileText className="w-4 h-4 text-red-500" />;
      case 'Video': return <Video className="w-4 h-4 text-blue-500" />;
      case 'Reading': return <Book className="w-4 h-4 text-green-500" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  const filteredMaterials = filterSubject === "all" 
    ? materials 
    : materials?.filter(m => m.subjectId.toString() === filterSubject);

  const isLoading = matLoading || subLoading;

  return (
    <LayoutShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-800">Learning Materials</h2>
          <p className="text-slate-500 mt-1">Upload and manage course resources</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
              <Plus className="w-4 h-4 mr-2" />
              Add Material
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Material</DialogTitle>
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
                      <FormControl><Input placeholder="e.g. Chapter 1 Slides" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Link">Link</SelectItem>
                          <SelectItem value="PDF">PDF</SelectItem>
                          <SelectItem value="Video">Video</SelectItem>
                          <SelectItem value="Document">Document</SelectItem>
                          <SelectItem value="Reading">Reading Material (Multi-page)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {materialType === 'Reading' ? (
                  <div className="space-y-4">
                    <FormLabel>Content Pages</FormLabel>
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <FormField
                          control={form.control}
                          name={`pages.${index}` as any}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Textarea 
                                  placeholder={`Page ${index + 1} content...`} 
                                  {...field} 
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => remove(index)}
                          disabled={fields.length === 1}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => append("")}
                    >
                      Add Page
                    </Button>
                  </div>
                ) : (
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief description..." 
                          {...field} 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={createMaterial.isPending}>
                  {createMaterial.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Material"}
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
        ) : filteredMaterials?.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No materials found.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaterials?.map((material) => (
                <TableRow key={material.id}>
                  <TableCell className="font-medium">
                    {material.type === 'Reading' ? (
                      <div className="flex items-center gap-2 text-green-600">
                        {getIcon(material.type)}
                        {material.title}
                        <span className="text-xs text-slate-400">({material.pages?.length || 0} pages)</span>
                      </div>
                    ) : (
                      <a href={material.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                        {getIcon(material.type)}
                        {material.title}
                      </a>
                    )}
                  </TableCell>
                  <TableCell>{getSubjectName(material.subjectId)}</TableCell>
                  <TableCell>{material.type}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        if (confirm('Delete this material?')) deleteMaterial.mutate(material.id);
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
