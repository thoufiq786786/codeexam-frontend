import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { loginStudent } from '@/services/mockApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Code2, LogIn, ArrowRight } from 'lucide-react';

const Login = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Connect to your FastAPI Student Login route
      const response = await fetch('http://127.0.0.1:8000/api/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Ensure keys match your LoginSchema (username/password)
        body: JSON.stringify({ 
          username: rollNumber, 
          password: password 
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // 2. Log the student into your AuthContext
        login({ 
          ...data.user, 
          role: 'student' 
        });

        toast({
          title: "Welcome back!",
          description: `Logged in as ${data.user.name}`,
        });
        
        navigate('/dashboard');
      } else {
        throw new Error(data.detail || "Invalid credentials");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Connection to backend failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Code2 className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-sidebar-foreground">CodeExam</span>
          </div>
          
          <h1 className="text-4xl xl:text-5xl font-bold text-sidebar-foreground mb-6 leading-tight">
            Master Coding Through
            <span className="block gradient-text">Practice & Assessment</span>
          </h1>
          
          <p className="text-lg text-sidebar-foreground/70 max-w-md">
            Join thousands of students improving their coding skills through structured assessments and real-time feedback.
          </p>
          
          <div className="mt-12 grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-sidebar-foreground/60">Problems</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-sidebar-foreground/60">Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">95%</div>
              <div className="text-sm text-sidebar-foreground/60">Success Rate</div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-2xl" />
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Code2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">CodeExam</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Student Login</h2>
            <p className="text-muted-foreground">Enter your credentials to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="rollNumber">Roll Number</Label>
              <Input
                id="rollNumber"
                type="text"
                placeholder="Enter your roll number"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Login
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Register here
              </Link>
            </p>
          </div>

          {/* <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground text-center mb-2">Demo Credentials:</p>
            <div className="text-sm space-y-1">
              <p><strong>Student 1:</strong> Roll: 101, Pass: alex123</p>
              <p><strong>Student 2:</strong> Roll: 102, Pass: john123</p>
            </div>
          </div> */}

          <div className="mt-6 text-center">
            <Link 
              to="/admin/login" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Admin Login <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
