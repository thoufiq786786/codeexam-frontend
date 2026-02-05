import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
// Removed loginAdmin mock import
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Code2, Shield, LogIn, ArrowLeft } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Direct call to your Python FastAPI backend
      const response = await fetch('http://127.0.0.1:8000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Authenticate the user in your context with MongoDB data
        login(data.user); 
        
        toast({
          title: "Welcome Admin!",
          description: data.message,
        });

        // Navigate to the real dashboard
        navigate('/admin/dashboard');
      } else {
        // Handle 401 Unauthorized or other errors from FastAPI
        throw new Error(data.detail || "Invalid admin credentials");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Unable to connect to the server",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sidebar flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Link 
          to="/login" 
          className="inline-flex items-center text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Student Login
        </Link>

        <div className="bg-card rounded-2xl p-8 shadow-deep">
          <div className="flex items-center gap-3 justify-center mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Admin Portal</h2>
            <p className="text-muted-foreground">Sign in to manage the platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
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
                  Login as Admin
                </>
              )}
            </Button>
          </form>

          {/* <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground text-center mb-2">Demo Credentials:</p>
            <p className="text-sm text-center">
              <strong>Username:</strong> admin | <strong>Password:</strong> admin123
            </p>
          </div> */}
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
            <Code2 className="w-5 h-5" />
            <span className="font-semibold">CodeExam</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;