import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Code2, 
  LogOut, 
  Play, 
  Send, 
  CheckCircle2, 
  Circle,
  ChevronDown,
  ChevronUp,
  Eye,
  LayoutDashboard,
  FileText
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<'python' | 'java'>('python');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());
  const [showCompleted, setShowCompleted] = useState(false);
  const [showAnswerVisible, setShowAnswerVisible] = useState(false);
  const [isSolutionRevealed, setIsSolutionRevealed] = useState(false);

  // 1. Load Data: Sync with MongoDB (appended answers) and LocalStorage
  useEffect(() => {
    const initializeDashboard = async () => {
      if (!user) return;
      try {
        // Fetch submission status to get list of already completed IDs in DB
        const checkRes = await fetch(`https://codeexam-api.onrender.com/api/student/check-submission/${user.rollNumber}`);
        const status = await checkRes.json();
        
        const qResponse = await fetch('https://codeexam-api.onrender.com/api/admin/questions');
        const allQuestions = await qResponse.json();
        setQuestions(allQuestions);

        let testSession = JSON.parse(localStorage.getItem('testSession') || 'null');
        if (!testSession) {
          testSession = { startTime: Date.now(), answers: {} };
          localStorage.setItem('testSession', JSON.stringify(testSession));
        }
        setSession(testSession);

        // Mark questions as completed if they exist in DB answers list
        const dbCompleted = new Set<string>(status.completedIds || []);
        setCompletedQuestions(dbCompleted);

        if (allQuestions.length > 0) {
          const nextPending = allQuestions.find((q: any) => !dbCompleted.has(q.id)) || allQuestions[0];
          setSelectedQuestion(nextPending);
          
          // Load work from local session if it exists
          const savedWork = testSession.answers[nextPending.id];
          setCode(savedWork?.code || nextPending.starterCode[language]);
          setLanguage(savedWork?.language || 'python');
        }
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };
    initializeDashboard();
  }, [user]);

  // 2. Question Selection: Save current work locally before switching
  const handleQuestionSelect = (question: any) => {
    if (selectedQuestion && session) {
      const updatedAnswers = { 
        ...session.answers, 
        [selectedQuestion.id]: { code, language, passed: completedQuestions.has(selectedQuestion.id) } 
      };
      const updatedSession = { ...session, answers: updatedAnswers };
      setSession(updatedSession);
      localStorage.setItem('testSession', JSON.stringify(updatedSession));
    }

    setSelectedQuestion(question);
    const saved = session?.answers?.[question.id];
    setCode(saved?.code || question.starterCode[language]);
    setLanguage(saved?.language || 'python');
    setOutput('');
    setShowAnswerVisible(saved?.passed || false);
    setIsSolutionRevealed(false);
  };

  const handleLanguageChange = (newLang: 'python' | 'java') => {
    setLanguage(newLang);
    if (selectedQuestion) {
      const saved = session?.answers?.[selectedQuestion.id];
      if (!saved?.code) setCode(selectedQuestion.starterCode[newLang]);
    }
  };

  // 3. Code Execution (Compiler)
  const handleRun = async () => {
    if (!selectedQuestion) return;
    setIsRunning(true);
    setOutput('Running code...');
    try {
      const res = await fetch('https://codeexam-api.onrender.com/api/student/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, source: code, input: selectedQuestion.sampleInput }),
      });
      const data = await res.json();
      setOutput(data.stderr || data.output || "No output returned.");
    } catch (error) {
      setOutput("Execution failed.");
    } finally { setIsRunning(false); }
  };

  // 4. Submit: Appends single answer to the DB list
  const handleSubmit = async () => {
    if (!selectedQuestion) return;
    setIsSubmitting(true);
    setOutput('Validating test cases...');
    
    let allPassed = true;
    let resultsSummary = "";

    try {
      for (const [index, tc] of selectedQuestion.testCases.entries()) {
        const res = await fetch('https://codeexam-api.onrender.com/api/student/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language, source: code, input: tc.input }),
        });
        const data = await res.json();
        const isCorrect = data.output?.trim() === tc.expectedOutput?.trim();
        if (!isCorrect) allPassed = false;
        resultsSummary += `Test Case ${index + 1}: ${isCorrect ? "PASSED ✅" : "FAILED ❌"}\n`;
      }

      setOutput(resultsSummary);
      setShowAnswerVisible(true);

      // Inside Dashboard.tsx -> handleSubmit()
      if (allPassed) {
        setCompletedQuestions(prev => new Set([...prev, selectedQuestion.id]));
        
        const payload = {
          studentName: user.name,
          rollNumber: user.rollNumber,
          obtainedMarks: selectedQuestion.marks, // ONLY the marks for this specific question
          totalMarks: questions.reduce((sum, q) => sum + q.marks, 0),
          correctAnswers: 1, // Incremented by the backend via $inc
          wrongAnswers: 0,
          timeTaken: 0, 
          answers: [{
            questionId: selectedQuestion.id,
            code,
            language,
            passed: true,
            marks: selectedQuestion.marks
          }]
        };

        await fetch('https://codeexam-api.onrender.com/api/student/save-result', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        toast({ title: "Passed!", description: "Solution appended to your results." });
      } else {
        toast({ variant: "destructive", title: "Failed", description: "Incorrect solution." });
      }

      // Save work to local session
      const updatedAnswers = { 
        ...session.answers, 
        [selectedQuestion.id]: { code, language, passed: allPassed } 
      };
      const newSession = { ...session, answers: updatedAnswers };
      setSession(newSession);
      localStorage.setItem('testSession', JSON.stringify(newSession));

    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Sync failed." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col font-sans overflow-hidden">
      {/* Navbar Content removed for full focus */}
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar with Navigation and Actions */}
        <aside className="w-72 border-r bg-card p-4 flex flex-col overflow-y-auto">
          <div className="mb-6 space-y-1">
            <h2 className="text-xs font-semibold uppercase text-muted-foreground mb-2 px-2 tracking-wider">Navigation</h2>
            <Button variant="ghost" className="w-full justify-start text-primary" onClick={() => navigate('/dashboard')}>
              <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start hover:text-primary" onClick={() => navigate('/result')}>
              <FileText className="w-4 h-4 mr-2" /> Leaderboard
            </Button>
          </div>

          <h2 className="text-xs font-semibold uppercase text-muted-foreground mb-4 px-2 tracking-wider">Questions</h2>
          <div className="space-y-2 flex-1">
            {questions.filter(q => !completedQuestions.has(q.id)).map((q, i) => (
              <button key={q.id} onClick={() => handleQuestionSelect(q)} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${selectedQuestion?.id === q.id ? 'bg-primary text-white shadow-lg' : 'hover:bg-secondary'}`}>
                <Circle className="w-4 h-4 opacity-40" />
                <span className="text-sm font-medium truncate">{q.title}</span>
              </button>
            ))}

            {completedQuestions.size > 0 && (
              <div className="pt-4 mt-4 border-t">
                <button onClick={() => setShowCompleted(!showCompleted)} className="w-full flex items-center justify-between text-xs font-bold text-emerald-600 p-2 bg-emerald-50 rounded-lg">
                  <span>Completed ({completedQuestions.size})</span>
                  {showCompleted ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {showCompleted && (
                  <div className="mt-2 space-y-1">
                    {questions.filter(q => completedQuestions.has(q.id)).map((q) => (
                      <button key={q.id} onClick={() => handleQuestionSelect(q)} className={`w-full flex items-center gap-3 p-2 rounded-lg opacity-60 ${selectedQuestion?.id === q.id ? 'bg-secondary' : ''}`}>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs line-through">{q.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="mt-auto pt-4 border-t space-y-2">
            {/* <Button onClick={() => navigate('/result')} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
              <Send className="w-4 h-4 mr-2" /> Finish Test
            </Button> */}
            <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={() => { logout(); navigate('/login'); }}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="lg:w-1/3 border-r p-6 overflow-y-auto bg-card/30">
            {selectedQuestion && (
              <>
                <h1 className="text-2xl font-bold mb-2 tracking-tight">{selectedQuestion.title}</h1>
                <DifficultyBadge difficulty={selectedQuestion.difficulty} />
                <div className="mt-6 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{selectedQuestion.description}</div>
                
                <div className="mt-8 space-y-4">
                  <div className="p-4 bg-secondary/50 rounded-xl border border-border text-xs font-mono">
                    <p className="font-bold uppercase text-muted-foreground mb-2 tracking-widest text-[10px]">Sample Input</p>
                    {selectedQuestion.sampleInput}
                  </div>
                  <div className="p-4 bg-secondary/50 rounded-xl border border-border text-xs font-mono">
                    <p className="font-bold uppercase text-muted-foreground mb-2 tracking-widest text-[10px]">Expected Output</p>
                    {selectedQuestion.sampleOutput}
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    {showAnswerVisible && !isSolutionRevealed && (
                      <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/5" onClick={() => setIsSolutionRevealed(true)}>
                        <Eye className="w-4 h-4 mr-2" /> Show Model Answer
                      </Button>
                    )}
                    {isSolutionRevealed && (
                      <div className="animate-in fade-in slide-in-from-top-2">
                        <p className="text-xs font-bold text-primary mb-2 uppercase tracking-tighter">Correct Solution</p>
                        <pre className="bg-slate-900 p-4 rounded-xl font-mono text-[11px] text-slate-300 border border-primary/20 overflow-x-auto">
                          {selectedQuestion.solution || "// Solution not provided."}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex-1 flex flex-col">
            <div className="h-14 border-b flex items-center justify-between px-6 bg-card/80 backdrop-blur-md">
              <Select value={language} onValueChange={(v) => handleLanguageChange(v as any)}>
                <SelectTrigger className="w-36 h-9 text-xs font-semibold"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="python">Python 3</SelectItem><SelectItem value="java">Java 15</SelectItem></SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleRun} disabled={isRunning} className="h-9">
                  <Play className="w-3 h-3 mr-2" /> Run
                </Button>
                <Button size="sm" onClick={handleSubmit} disabled={isSubmitting} className="h-9 bg-primary px-4">
                  <Send className="w-3 h-3 mr-2" /> Submit Code
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <Editor 
                height="100%" 
                language={language} 
                value={code} 
                onChange={(v) => setCode(v || '')} 
                theme="vs-dark" 
                options={{ 
                  fontSize: 14, 
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  padding: { top: 20 }
                }} 
              />
            </div>
            <div className="h-44 bg-[#0d0d0d] p-5 font-mono text-[11px] text-emerald-400 overflow-y-auto border-t border-white/5">
              <p className="text-white/30 mb-2 uppercase tracking-widest text-[9px] font-bold">// Terminal Output</p>
              <pre className="whitespace-pre-wrap leading-relaxed">{output}</pre>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
