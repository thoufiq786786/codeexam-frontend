import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
// Removed mockApi imports
import { Button } from '@/components/ui/button';
import { 
  Code2, 
  LogOut, 
  PlusCircle, 
  FileText, 
  Users, 
  BarChart3,
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for real data from MongoDB
  const [questionsCount, setQuestionsCount] = useState(0);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all required data from the backend
  const fetchDashboardData = async () => {
    try {
      // 1. Fetch Questions for the count
      const qRes = await fetch('http://127.0.0.1:8000/api/admin/questions');
      const qData = await qRes.json();
      setQuestionsCount(qData.length);

      // 2. Fetch Results for stats and activity list
      const rRes = await fetch('http://127.0.0.1:8000/api/admin/results');
      const rData = await rRes.json();
      setResults(rData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to connect to the backend server.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Calculate dynamic stats
  const avgScore = results.length > 0 
    ? Math.round(results.reduce((sum, r) => sum + (r.obtainedMarks / r.totalMarks) * 100, 0) / results.length) + '%'
    : '0%';

  const stats = [
    { label: 'Total Questions', value: questionsCount, icon: FileText, color: 'text-primary' },
    { label: 'Total Students', value: results.length, icon: Users, color: 'text-success' },
    { label: 'Avg Score', value: avgScore, icon: BarChart3, color: 'text-warning' },
  ];

  const cards = [
    {
      title: 'Add Question',
      description: 'Create a new coding problem with test cases',
      icon: PlusCircle,
      path: '/admin/add-question',
      color: 'bg-primary'
    },
    {
      title: 'Manage Questions',
      description: 'View, edit, or delete existing questions',
      icon: FileText,
      path: '/admin/questions',
      color: 'bg-success'
    },
    {
      title: 'View Results',
      description: 'See all student scores and export data',
      icon: Users,
      path: '/admin/results',
      color: 'bg-warning'
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-16 border-b bg-card flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
            <Code2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <span className="font-semibold">CodeExam</span>
            <span className="text-xs text-muted-foreground ml-2">Admin</span>
          </div>
        </div>
        
        <Button variant="ghost" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </header>

      <main className="container max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage questions, view results, and monitor platform activity</p>
        </div>

        {/* Dynamic Stats Section */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card-elevated p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className={`w-10 h-10 ${stat.color} opacity-20`} />
              </div>
            </div>
          ))}
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <Link 
              key={index} 
              to={card.path}
              className="card-interactive p-6 group"
            >
              <div className={`w-14 h-14 ${card.color} rounded-xl flex items-center justify-center mb-4`}>
                <card.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                {card.title}
                <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
              </h3>
              <p className="text-muted-foreground text-sm">{card.description}</p>
            </Link>
          ))}
        </div>

        {/* Recent Activity List from MongoDB */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Submissions</h2>
          <div className="card-elevated overflow-hidden">
            {results.length > 0 ? (
              <div className="divide-y">
                {results.slice(0, 5).map((result) => (
                  <div key={result.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium">{result.studentName}</p>
                      <p className="text-sm text-muted-foreground">Roll: {result.rollNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">{result.obtainedMarks}/{result.totalMarks}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(result.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                No submissions yet
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;