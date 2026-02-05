import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Users, ArrowLeft, CheckCircle } from 'lucide-react';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/admin/results');
        const data = await response.json();
        
        if (response.ok) {
          // Sort by obtainedMarks (descending), then by problem count
          const sortedData = [...data].sort((a, b) => {
            if (b.obtainedMarks !== a.obtainedMarks) {
              return b.obtainedMarks - a.obtainedMarks;
            }
            return (b.answers?.length || 0) - (a.answers?.length || 0);
          });
          setLeaders(sortedData);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-amber-500" />;
    if (index === 1) return <Medal className="w-5 h-5 text-slate-400" />;
    if (index === 2) return <Medal className="w-5 h-5 text-amber-700" />;
    return <span className="text-sm font-bold text-muted-foreground w-5 text-center">{index + 1}</span>;
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Global Rankings...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
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
                <tr key={student.rollNumber} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5 whitespace-nowrap">
                    {getRankIcon(index)}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{student.studentName}</span>
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
    </div>
  );
};

export default Leaderboard;