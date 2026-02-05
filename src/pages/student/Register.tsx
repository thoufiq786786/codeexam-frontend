import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerStudent } from '@/services/mockApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Code2, UserPlus, ArrowLeft } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Existing validation...
    if (password !== confirmPassword) {
      toast({ variant: "destructive", title: "Password mismatch", description: "Passwords do not match" });
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/student/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          rollNumber, 
          password 
        }),
      });
  
      const data = await response.json();
  
      if (response.ok && data.success) {
        toast({
          title: "Registration successful!",
          description: "You can now login with your credentials",
        });
        navigate('/login');
      } else {
        throw new Error(data.detail || "Registration failed");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Connection to server failed",
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
            Start Your
            <span className="block gradient-text">Coding Journey</span>
          </h1>
          
          <p className="text-lg text-sidebar-foreground/70 max-w-md">
            Create your account and join our community of learners. Practice coding problems and track your progress.
          </p>

          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-semibold">1</span>
              </div>
              <span className="text-sidebar-foreground/80">Create your account</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-semibold">2</span>
              </div>
              <span className="text-sidebar-foreground/80">Start solving problems</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-semibold">3</span>
              </div>
              <span className="text-sidebar-foreground/80">Track your progress</span>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          <Link 
            to="/login" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
          </Link>

          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Code2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">CodeExam</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Create Account</h2>
            <p className="text-muted-foreground">Fill in your details to register</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12"
              />
            </div>

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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
