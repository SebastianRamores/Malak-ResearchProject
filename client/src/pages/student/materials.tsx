import { useState } from "react";
import { LayoutShell } from "@/components/layout-shell";
import { useMaterials, useSubjects } from "@/hooks/use-store";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, Link as LinkIcon, FileText, Video, File, Loader2, Book, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Material } from "@/lib/types";

export default function StudentMaterialsPage() {
  const { data: materials, isLoading: matLoading } = useMaterials();
  const { data: subjects, isLoading: subLoading } = useSubjects();
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [readingMaterial, setReadingMaterial] = useState<Material | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const getSubjectName = (id: number) => subjects?.find(s => s.id === id)?.name || "Unknown";

  const getIcon = (type: string) => {
    switch(type) {
      case 'Link': return <LinkIcon className="w-5 h-5 text-indigo-500" />;
      case 'PDF': return <FileText className="w-5 h-5 text-red-500" />;
      case 'Video': return <Video className="w-5 h-5 text-blue-500" />;
      case 'Reading': return <Book className="w-5 h-5 text-green-500" />;
      default: return <File className="w-5 h-5 text-slate-500" />;
    }
  };

  const filteredMaterials = filterSubject === "all" 
    ? materials 
    : materials?.filter(m => m.subjectId.toString() === filterSubject);

  const isLoading = matLoading || subLoading;

  const openReading = (m: Material) => {
    setReadingMaterial(m);
    setCurrentPage(0);
  };

  return (
    <LayoutShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-800">Learning Materials</h2>
          <p className="text-slate-500 mt-1">Access your course resources and study guides</p>
        </div>
        <Select value={filterSubject} onValueChange={setFilterSubject}>
          <SelectTrigger className="w-[200px] bg-white">
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
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No learning materials available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredMaterials?.map((material) => (
            <Card key={material.id} className="group hover:shadow-md transition-all border-slate-100 overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    {getIcon(material.type)}
                  </div>
                  <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded text-slate-600 uppercase tracking-wider">
                    {material.type}
                  </span>
                </div>
                <CardTitle className="text-lg line-clamp-1">{material.title}</CardTitle>
                <p className="text-xs text-slate-400">{getSubjectName(material.subjectId)}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 line-clamp-2 mb-4 h-10">
                  {material.description || "No description provided."}
                </p>
                {material.type === 'Reading' ? (
                  <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => openReading(material)}>
                    Open Reader ({material.pages?.length || 0} pages)
                  </Button>
                ) : (
                  <Button className="w-full bg-slate-900 hover:bg-slate-800" asChild>
                    <a href={material.url} target="_blank" rel="noopener noreferrer">
                      Open Material
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Book/Paper Template Reader Dialog */}
      <Dialog open={!!readingMaterial} onOpenChange={(open) => !open && setReadingMaterial(null)}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden bg-slate-100 border-none">
          <div className="p-4 bg-white border-b flex items-center justify-between">
            <DialogTitle className="text-xl font-display font-bold flex items-center gap-2">
              <Book className="w-5 h-5 text-green-600" />
              {readingMaterial?.title}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => setReadingMaterial(null)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-auto p-8 flex justify-center">
            {/* The "Paper" Template */}
            <div className="w-full max-w-[800px] min-h-full bg-white shadow-2xl rounded-sm p-12 md:p-16 relative border border-slate-200">
              {/* Decorative paper line */}
              <div className="absolute left-12 top-0 bottom-0 w-px bg-red-100" />
              
              <div className="relative z-10 prose prose-slate max-w-none">
                <div className="flex justify-between items-center mb-8 border-b pb-2 text-slate-400 text-xs uppercase tracking-widest font-bold">
                  <span>Page {currentPage + 1} of {readingMaterial?.pages?.length}</span>
                  <span>{getSubjectName(readingMaterial?.subjectId || 0)}</span>
                </div>
                
                <div className="min-h-[500px] text-lg leading-relaxed text-slate-800 whitespace-pre-wrap font-serif">
                  {readingMaterial?.pages?.[currentPage]}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border-t flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>
            
            <div className="text-sm font-medium text-slate-500">
              Reading Progress: {Math.round(((currentPage + 1) / (readingMaterial?.pages?.length || 1)) * 100)}%
            </div>

            <Button 
              className="bg-green-600 hover:bg-green-700 gap-2"
              onClick={() => setCurrentPage(prev => Math.min((readingMaterial?.pages?.length || 1) - 1, prev + 1))}
              disabled={currentPage === (readingMaterial?.pages?.length || 1) - 1}
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </LayoutShell>
  );
}
