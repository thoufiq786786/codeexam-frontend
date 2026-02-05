import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Code2, ArrowRight, Users, Trophy, BookOpen } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
        
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Code2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">CodeExam</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Student Login</Button>
              </Link>
              <Link to="/admin/login">
                <Button variant="outline">Admin Portal</Button>
              </Link>
            </div>
          </nav>

          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Master Coding Through
              <span className="block gradient-text">Practice & Assessment</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A comprehensive online examination platform for coding assessments. 
              Practice problems, take timed tests, and track your progress.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto text-base px-8">
                  Get Started <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card-elevated p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Curated Problems</h3>
            <p className="text-muted-foreground">
              Practice with carefully crafted coding problems across different difficulty levels.
            </p>
          </div>
          
          <div className="card-elevated p-8 text-center">
            <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Code2 className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Live Code Editor</h3>
            <p className="text-muted-foreground">
              Write and test your code in our powerful Monaco-based editor with syntax highlighting.
            </p>
          </div>
          
          <div className="card-elevated p-8 text-center">
            <div className="w-16 h-16 bg-warning/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-8 h-8 text-warning" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Leaderboards</h3>
            <p className="text-muted-foreground">
              Compete with others and track your ranking on the global leaderboard.
            </p>
          </div>
        </div>
      </div>

      {/* Demo Info */}
      <div className="container mx-auto px-4 py-16">
        <div className="card-elevated p-8 lg:p-12 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Demo Mode Active</h2>
          <p className="text-muted-foreground mb-6">
            This platform is running in demo mode with mock data. 
            No backend required - everything is stored in localStorage.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4 text-left max-w-md mx-auto">
            <div className="p-4 bg-secondary rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" /> Student Login
              </h4>
              <p className="text-sm text-muted-foreground">
                Roll: <strong>101</strong> | Pass: <strong>alex123</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Roll: <strong>102</strong> | Pass: <strong>john123</strong>
              </p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Code2 className="w-4 h-4" /> Admin Login
              </h4>
              <p className="text-sm text-muted-foreground">
                User: <strong>admin</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Pass: <strong>admin123</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Code2 className="w-5 h-5" />
            <span className="font-semibold">CodeExam</span>
          </div>
          <p className="text-sm">Online Coding Examination Platform</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
