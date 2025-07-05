import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
const RecoverPassword = () => {
    const [formData, setFormData] = useState({ email: "", recoveryWord: "" });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => {
                const n = { ...prev };
                delete n[name];
                return n;
            });
        }
    };
    const validate = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = "Email is required";
        }
        else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }
        if (!formData.recoveryWord) {
            newErrors.recoveryWord = "Recovery word is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate())
            return;
        setIsLoading(true);
        try {
            const res = await fetch("http://localhost:3000/api/recover-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data?.error || "Invalid data");
            navigate(`/reset-password?email=${encodeURIComponent(formData.email)}`);
        }
        catch (err) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<div className="container mx-auto flex h-screen items-center justify-center py-10">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Recover Password</CardTitle>
          <CardDescription>Enter your email and recovery word.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} disabled={isLoading} aria-invalid={!!errors.email}/>
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="recoveryWord">Recovery word</Label>
              <Input id="recoveryWord" name="recoveryWord" value={formData.recoveryWord} onChange={handleChange} disabled={isLoading} aria-invalid={!!errors.recoveryWord}/>
              {errors.recoveryWord && <p className="text-sm text-destructive">{errors.recoveryWord}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (<>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Validating...
                </>) : ("Continue")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>);
};
export default RecoverPassword;
