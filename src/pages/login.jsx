import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, School } from "lucide-react";
import { motion } from "framer-motion";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (checked) => {
    setFormData((prev) => ({ ...prev, rememberMe: checked }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Login failed");
      }

      toast({ title: "Success", description: "You are now logged in." });
      setUser(data.user);
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Demo accounts for quick login
  const demoAccounts = [
    { role: "Admin", email: "admin@school.com", password: "admin1234" },
    { role: "Teacher", email: "teacher@school.com", password: "teacher1234" },
    { role: "Student", email: "student@school.com", password: "student1234" }
  ];

  const loginWithDemoAccount = (account) => {
    setFormData({
      email: account.email,
      password: account.password,
      rememberMe: true
    });
  };

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center py-10">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        <motion.div 
          className="hidden md:flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-2xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <School className="h-16 w-16 text-primary mb-6" />
          <h1 className="text-3xl font-bold text-center mb-4 gradient-text">School Attendance System</h1>
          <p className="text-center text-muted-foreground mb-8">
            Welcome back! Sign in to access your dashboard and manage attendance, uniform compliance, and reports.
          </p>
          <div className="w-full max-w-xs space-y-3">
            {demoAccounts.map((account, index) => (
              <Button 
                key={index} 
                variant="outline" 
                className="w-full justify-between group"
                onClick={() => loginWithDemoAccount(account)}
              >
                <span>Login as {account.role}</span>
                <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {account.email}
                </span>
              </Button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <School className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Sign in</CardTitle>
              </div>
              <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/recover-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={errors.password ? "border-destructive" : ""}
                  />
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="rememberMe" 
                    checked={formData.rememberMe} 
                    onCheckedChange={handleCheckboxChange} 
                  />
                  <Label htmlFor="rememberMe" className="text-sm font-normal">
                    Remember me
                  </Label>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>

          {/* Demo accounts for mobile */}
          <div className="mt-6 md:hidden">
            <h3 className="text-sm font-medium text-center mb-3">Demo Accounts</h3>
            <div className="grid grid-cols-3 gap-2">
              {demoAccounts.map((account, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  size="sm"
                  onClick={() => loginWithDemoAccount(account)}
                >
                  {account.role}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginForm;