import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addQuestion } from '@/services/mockApi';
import { TestCase } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Code2, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save,
  FileCode
} from 'lucide-react';

const AddQuestion = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [marks, setMarks] = useState(10);
  const [sampleInput, setSampleInput] = useState('');
  const [sampleOutput, setSampleOutput] = useState('');
  const [pythonStarter, setPythonStarter] = useState('def solution():\n    # Write your code here\n    pass');
  const [javaStarter, setJavaStarter] = useState('public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}');
  const [testCases, setTestCases] = useState<Omit<TestCase, 'id'>[]>([
    { input: '', expectedOutput: '', isHidden: false }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '', isHidden: false }]);
  };

  const removeTestCase = (index: number) => {
    if (testCases.length > 1) {
      setTestCases(testCases.filter((_, i) => i !== index));
    }
  };

  const updateTestCase = (index: number, field: keyof Omit<TestCase, 'id'>, value: string | boolean) => {
    const updated = [...testCases];
    updated[index] = { ...updated[index], [field]: value };
    setTestCases(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation logic remains the same...
    if (!title || !description || !sampleInput || !sampleOutput) {
      toast({ variant: "destructive", title: "Validation Error", description: "Please fill in all required fields" });
      return;
    }
  
    setIsSubmitting(true);
  
    const questionData = {
      title,
      description,
      difficulty,
      marks,
      sampleInput,
      sampleOutput,
      testCases: testCases.map((tc, i) => ({ ...tc, id: `tc${i + 1}` })),
      starterCode: {
        python: pythonStarter,
        java: javaStarter
      }
    };
  
    try {
      const response = await fetch('https://codeexam-api.onrender.com/api/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionData),
      });
  
      const data = await response.json();
  
      if (response.ok && data.success) {
        toast({
          title: "Question Added!",
          description: data.message,
        });
        navigate('/admin/questions');
      } else {
        throw new Error(data.detail || "Failed to save question");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Connection to backend failed",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
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

      <main className="container max-w-4xl mx-auto py-8 px-4">
        <Link 
          to="/admin/dashboard" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <FileCode className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold">Add New Question</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="card-elevated p-6 space-y-6">
            <h2 className="text-lg font-semibold border-b pb-3">Basic Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Two Sum Problem"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty *</Label>
                <Select value={difficulty} onValueChange={(v) => setDifficulty(v as 'Easy' | 'Medium' | 'Hard')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="marks">Marks *</Label>
                <Input
                  id="marks"
                  type="number"
                  min="1"
                  max="100"
                  value={marks}
                  onChange={(e) => setMarks(parseInt(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Write a detailed problem description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={8}
                  required
                />
              </div>
            </div>
          </div>

          {/* Sample I/O */}
          <div className="card-elevated p-6 space-y-6">
            <h2 className="text-lg font-semibold border-b pb-3">Sample Input/Output</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="sampleInput">Sample Input *</Label>
                <Textarea
                  id="sampleInput"
                  placeholder="[1, 2, 3, 4, 5]"
                  value={sampleInput}
                  onChange={(e) => setSampleInput(e.target.value)}
                  rows={3}
                  className="font-mono text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sampleOutput">Sample Output *</Label>
                <Textarea
                  id="sampleOutput"
                  placeholder="15"
                  value={sampleOutput}
                  onChange={(e) => setSampleOutput(e.target.value)}
                  rows={3}
                  className="font-mono text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Starter Code */}
          <div className="card-elevated p-6 space-y-6">
            <h2 className="text-lg font-semibold border-b pb-3">Starter Code</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="pythonStarter">Python Starter Code</Label>
                <Textarea
                  id="pythonStarter"
                  value={pythonStarter}
                  onChange={(e) => setPythonStarter(e.target.value)}
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="javaStarter">Java Starter Code</Label>
                <Textarea
                  id="javaStarter"
                  value={javaStarter}
                  onChange={(e) => setJavaStarter(e.target.value)}
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Test Cases */}
          <div className="card-elevated p-6 space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-lg font-semibold">Test Cases</h2>
              <Button type="button" variant="outline" size="sm" onClick={addTestCase}>
                <Plus className="w-4 h-4 mr-1" /> Add Test Case
              </Button>
            </div>
            
            <div className="space-y-4">
              {testCases.map((tc, index) => (
                <div key={index} className="p-4 bg-secondary rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Test Case {index + 1}</span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={tc.isHidden}
                          onChange={(e) => updateTestCase(index, 'isHidden', e.target.checked)}
                          className="rounded"
                        />
                        Hidden
                      </label>
                      {testCases.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeTestCase(index)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Input</Label>
                      <Input
                        placeholder="Test input"
                        value={tc.input}
                        onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                        className="font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Expected Output</Label>
                      <Input
                        placeholder="Expected output"
                        value={tc.expectedOutput}
                        onChange={(e) => updateTestCase(index, 'expectedOutput', e.target.value)}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/questions')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Question
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddQuestion;
