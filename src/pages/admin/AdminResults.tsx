import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getResults, getQuestions } from '@/services/mockApi';
import { TestResult } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Code2, 
  ArrowLeft, 
  Download, 
  Users,
  Trophy,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const AdminResults = () => {
  const { toast } = useToast();
  const [results, setResults] = useState<TestResult[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setResults(getResults());
    setTotalQuestions(getQuestions().length);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };
const fetchStatsAndResults = async () => {
    try {
      // Fetch Questions count to calculate /total
      const qRes = await fetch('http://127.0.0.1:8000/api/admin/questions');
      const qData = await qRes.json();
      setTotalQuestions(qData.length);

      // Fetch Results from MongoDB
      const rRes = await fetch('http://127.0.0.1:8000/api/admin/results');
      const rData = await rRes.json();
      setResults(rData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Could not fetch results from the database",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatsAndResults();
  }, []);
  const handleExport = () => {
    // Create CSV content
    const headers = ['Rank', 'Name', 'Roll Number', 'Score', 'Correct', 'Wrong', 'Time Taken', 'Submitted At'];
    const rows = results.map((r, i) => [
      i + 1,
      r.studentName,
      r.rollNumber,
      `${r.obtainedMarks}/${r.totalMarks}`,
      r.correctAnswers,
      r.wrongAnswers,
      formatTime(r.timeTaken),
      new Date(r.submittedAt).toLocaleString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exam-results-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Results have been downloaded as CSV",
    });
  };

  const getScorePercentage = (obtained: number, total: number) => {
    return Math.round((obtained / total) * 100);
  };

  const getScoreClass = (obtained: number, total: number) => {
    const pct = getScorePercentage(obtained, total);
    if (pct >= 80) return 'text-success';
    if (pct >= 50) return 'text-warning';
    return 'text-destructive';
  };

  // Sort by score (desc), then by time (asc)
  const sortedResults = [...results].sort((a, b) => {
    if (b.obtainedMarks !== a.obtainedMarks) {
      return b.obtainedMarks - a.obtainedMarks;
    }
    return a.timeTaken - b.timeTaken;
  });

  const avgScore = results.length > 0 
    ? Math.round(results.reduce((sum, r) => sum + getScorePercentage(r.obtainedMarks, r.totalMarks), 0) / results.length)
    : 0;

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
            <Users className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Student Results</h1>
          </div>
          
          {results.length > 0 && (
            <Button onClick={handleExport} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{results.length}</p>
                <p className="text-sm text-muted-foreground">Submissions</p>
              </div>
            </div>
          </div>
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">{avgScore}%</p>
                <p className="text-sm text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </div>
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-success" />
              <div>
                <p className="text-2xl font-bold">
                  {results.filter(r => getScorePercentage(r.obtainedMarks, r.totalMarks) >= 50).length}
                </p>
                <p className="text-sm text-muted-foreground">Passed</p>
              </div>
            </div>
          </div>
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold">
                  {results.filter(r => getScorePercentage(r.obtainedMarks, r.totalMarks) < 50).length}
                </p>
                <p className="text-sm text-muted-foreground">Failed</p>
              </div>
            </div>
          </div>
        </div>

        {sortedResults.length > 0 ? (
          <div className="card-elevated overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">Rank</th>
                    <th className="text-left p-4 font-medium">Student</th>
                    <th className="text-left p-4 font-medium">Roll No.</th>
                    <th className="text-left p-4 font-medium">Score</th>
                    <th className="text-left p-4 font-medium">Correct</th>
                    <th className="text-left p-4 font-medium">Wrong</th>
                    <th className="text-left p-4 font-medium">Time</th>
                    <th className="text-left p-4 font-medium">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {sortedResults.map((r, index) => (
                    <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {index === 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
                          {index === 1 && <Trophy className="w-5 h-5 text-gray-400" />}
                          {index === 2 && <Trophy className="w-5 h-5 text-amber-600" />}
                          {index > 2 && <span className="w-5 text-center">{index + 1}</span>}
                        </div>
                      </td>
                      <td className="p-4 font-medium">{r.studentName}</td>
                      <td className="p-4 text-muted-foreground">{r.rollNumber}</td>
                      <td className="p-4">
                        <span className={`font-bold ${getScoreClass(r.obtainedMarks, r.totalMarks)}`}>
                          {r.obtainedMarks}/{r.totalMarks}
                        </span>
                        <span className="text-muted-foreground text-sm ml-2">
                          ({getScorePercentage(r.obtainedMarks, r.totalMarks)}%)
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-success">{r.correctAnswers}</span>
                        <span className="text-muted-foreground">/{totalQuestions}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-destructive">{r.wrongAnswers}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {formatTime(r.timeTaken)}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(r.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card-elevated p-12 text-center">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Results Yet</h2>
            <p className="text-muted-foreground">Student submissions will appear here</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminResults;
