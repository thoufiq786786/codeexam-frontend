import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Users, ArrowLeft, CheckCircle, Code, Lightbulb, X } from 'lucide-react';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]); // To store model solutions
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any>(null); // State for the drill-down view
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch results and questions in parallel
        const [resResponse, qResponse] = await Promise.all([
          fetch('https://codeexam-api.onrender.com/api/admin/results'),
          fetch('https://codeexam-api.onrender.com/api/admin/questions')
        ]);

        const resData = await resResponse.json();
        const qData = await qResponse.json();
        
        if (resResponse.ok) {
          const sortedData = [...resData].sort((a, b) => {
            if (b.obtainedMarks !== a.obtainedMarks) return b.obtainedMarks - a.obtainedMarks;
            return (b.answers?.length || 0) - (a.answers?.length || 0);
          });
          setLeaders(sortedData);
        }
        if (qResponse.ok) setQuestions(qData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getModelSolution = (qId: string) => {
    const question = questions.find(q => q.id === qId || q._id === qId);
    return question?.solution || "// No model solution available.";
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-amber-500" />;
    if (index === 1) return <Medal className="w-5 h-5 text-slate-400" />;
    if (index === 2) return <Medal className="w-5 h-5 text-amber-700" />;
    return <span className="text-sm font-bold text-muted-foreground w-5 text-center">{index + 1}</span>;
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-medium">Loading Rankings...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans relative">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-2xl">
              <Trophy className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Global Leaderboard</h1>
              <p className="text-slate-500 flex items-center gap-1">
                <Users className="w-4 h-4" /> Comparing {leaders.length} Active Students
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="rounded-xl border-slate-300">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Rank</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Solved</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Total Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaders.map((student, index) => (
                <tr 
                  key={student.rollNumber} 
                  className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                  onClick={() => setSelectedStudent(student)}
                >
                  <td className="px-6 py-5 whitespace-nowrap">{getRankIcon(index)}</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{student.studentName}</span>
                      <span className="text-xs text-slate-400 font-mono">{student.rollNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                      <CheckCircle className="w-3 h-3" />
                      <span className="text-xs font-black">{student.answers?.length || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right font-black text-slate-900">
                    <span className="text-blue-600">{student.obtainedMarks}</span>
                    <span className="text-slate-300 text-sm ml-1">pts</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- DRILL-DOWN MODAL: Comparison View --- */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-2xl font-black text-slate-900">{selectedStudent.studentName}'s Solutions</h2>
                <p className="text-slate-500 text-sm font-medium">Roll Number: {selectedStudent.rollNumber} • Total Score: {selectedStudent.obtainedMarks}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedStudent(null)} className="rounded-full">
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/50">
              {selectedStudent.answers?.map((ans: any, idx: number) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                   <div className="px-6 py-3 bg-white border-b border-slate-100 flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-600">Problem #{idx + 1}</span>
                    <span className="text-[10px] font-bold px-3 py-1 bg-blue-100 text-blue-700 rounded-full uppercase tracking-tight">
                      {ans.language || 'Code'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* User's Answer */}
                    <div className="p-6 border-r border-slate-100">
                      <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                        <Code className="w-3 h-3" /> Student's Submission
                      </h3>
                      <pre className="p-4 bg-slate-900 text-slate-300 rounded-xl font-mono text-[11px] h-64 overflow-auto shadow-inner">
                        {ans.code}
                      </pre>
                    </div>

                    {/* Website's Model Answer */}
                    <div className="p-6 bg-amber-50/10">
                      <h3 className="text-xs font-bold text-amber-600 uppercase mb-3 flex items-center gap-2">
                        <Lightbulb className="w-3 h-3" /> Official Solution
                      </h3>
                      <pre className="p-4 bg-white border border-amber-100 text-slate-700 rounded-xl font-mono text-[11px] h-64 overflow-auto shadow-sm">
                        {getModelSolution(ans.questionId)}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
              
              {(!selectedStudent.answers || selectedStudent.answers.length === 0) && (
                <div className="text-center py-20 text-slate-400 font-medium">
                  No code submissions found for this student.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
