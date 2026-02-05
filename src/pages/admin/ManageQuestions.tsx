import { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { getQuestions, deleteQuestion } from '@/services/mockApi';
import { Question } from '@/data/mockData';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';


import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Code2, 
  ArrowLeft, 
  Plus, 
  Pencil, 
  Trash2, 
  Eye,
  FileText
} from 'lucide-react';

const ManageQuestions = () => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewQuestion, setViewQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  

  // 1. Fetch questions from Backend on load
  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/admin/questions');
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to load questions" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // 2. Delete question logic
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/questions/delete/${deleteId}`, {
        method: 'POST',
      });
      const data = await response.json();

      if (response.ok && data.success) {
        toast({ title: "Deleted", description: data.message });
        fetchQuestions(); // Refresh the list
      } else {
        throw new Error(data.detail);
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setDeleteId(null);
    }
  };

  // ... rest of your component remains the same ...

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-16 border-b bg-card flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
            <Code2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold">CodeExam Admin</span>
        </div>
        
        <Link to="/admin/dashboard">
          <Button variant="ghost">Dashboard</Button>
        </Link>
      </header>

      <main className="container max-w-6xl mx-auto py-8 px-4">
        <Link 
          to="/admin/dashboard" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Manage Questions</h1>
          </div>
          
          <Link to="/admin/add-question">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </Link>
        </div>

        {questions.length > 0 ? (
          <div className="card-elevated overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">#</th>
                    <th className="text-left p-4 font-medium">Title</th>
                    <th className="text-left p-4 font-medium">Difficulty</th>
                    <th className="text-left p-4 font-medium">Marks</th>
                    <th className="text-left p-4 font-medium">Test Cases</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {questions.map((q, index) => (
                    <tr key={q.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 text-muted-foreground">{index + 1}</td>
                      <td className="p-4 font-medium">{q.title}</td>
                      <td className="p-4">
                        <DifficultyBadge difficulty={q.difficulty} />
                      </td>
                      <td className="p-4">{q.marks}</td>
                      <td className="p-4">{q.testCases.length}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setViewQuestion(q)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => navigate(`/admin/edit-question/${q.id}`)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setDeleteId(q.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card-elevated p-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Questions Yet</h2>
            <p className="text-muted-foreground mb-6">Create your first coding problem</p>
            <Link to="/admin/add-question">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </Link>
          </div>
        )}
      </main>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Question?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The question will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Question Modal */}
      <AlertDialog open={!!viewQuestion} onOpenChange={() => setViewQuestion(null)}>
        <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-3">
              {viewQuestion?.title}
              {viewQuestion && <DifficultyBadge difficulty={viewQuestion.difficulty} />}
            </AlertDialogTitle>
          </AlertDialogHeader>
          
          {viewQuestion && (
            <div className="space-y-4">
              <div className="flex gap-4 text-sm">
                <span className="text-muted-foreground">Marks: <strong className="text-foreground">{viewQuestion.marks}</strong></span>
                <span className="text-muted-foreground">Test Cases: <strong className="text-foreground">{viewQuestion.testCases.length}</strong></span>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{viewQuestion.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Sample Input</h4>
                  <pre className="text-sm bg-muted p-3 rounded font-mono">{viewQuestion.sampleInput}</pre>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Sample Output</h4>
                  <pre className="text-sm bg-muted p-3 rounded font-mono">{viewQuestion.sampleOutput}</pre>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Test Cases</h4>
                <div className="space-y-2">
                  {viewQuestion.testCases.map((tc, i) => (
                    <div key={tc.id} className="text-sm bg-muted p-3 rounded flex justify-between">
                      <span>
                        <strong>TC{i + 1}:</strong> {tc.input} → {tc.expectedOutput}
                      </span>
                      {tc.isHidden && <span className="text-muted-foreground">(Hidden)</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageQuestions;
