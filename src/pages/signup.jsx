import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    recoveryWord: "",
    role: "teacher", // default
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
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
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.name) {
      newErrors.name = "Name is required";
    }

    if (!formData.recoveryWord) {
      newErrors.recoveryWord = "Recovery word is required";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Respuesta del backend:", data);

      if (!res.ok) throw new Error(data?.error || "Signup failed");

      toast({ title: "Account created", description: "Welcome!" });
      setUser(data.user);
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='container mx-auto flex h-screen items-center justify-center py-10'>
      <Card className='mx-auto w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-2xl'>Create an account</CardTitle>
          <CardDescription>Enter your details below to create your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                name='name'
                placeholder='John Doe'
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className='text-sm text-destructive'>{errors.name}</p>}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='john@example.com'
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className='text-sm text-destructive'>{errors.email}</p>}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                name='password'
                type='password'
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                aria-invalid={!!errors.password}
              />
              {errors.password && <p className='text-sm text-destructive'>{errors.password}</p>}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='recoveryWord'>Recovery word</Label>
              <Input
                id='recoveryWord'
                name='recoveryWord'
                placeholder='Something only you know'
                value={formData.recoveryWord}
                onChange={handleChange}
                disabled={isLoading}
                aria-invalid={!!errors.recoveryWord}
              />
              {errors.recoveryWord && (
                <p className='text-sm text-destructive'>{errors.recoveryWord}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='role'>Role</Label>
              <select
                id='role'
                name='role'
                value={formData.role}
                onChange={handleChange}
                disabled={isLoading}
                className='w-full rounded border px-3 py-2'
              >
                <option value='admin'>Admin</option>
                <option value='teacher'>Teacher</option>
                <option value='student'>Student</option>
              </select>
              {errors.role && <p className='text-sm text-destructive'>{errors.role}</p>}
            </div>
          </CardContent>

          <CardFooter className='flex flex-col space-y-4'>
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Creating account...
                </>
              ) : (
                "Sign up"
              )}
            </Button>

            <p className='text-center text-sm text-muted-foreground'>
              Already have an account?{" "}
              <Link to='/login' className='text-primary underline underline-offset-4 hover:text-primary/90'>
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
