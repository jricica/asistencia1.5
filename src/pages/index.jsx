import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fine } from "@/lib/fine";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();
  const { data: session, isPending } = fine.auth.useSession();

  useEffect(() => {
    if (!isPending && session) {
      navigate("/dashboard");
    }
  }, [session, isPending, navigate]);

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">School Attendance System</CardTitle>
          <CardDescription>Manage student attendance and uniform compliance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            A comprehensive system for administrators and teachers to track student attendance,
            uniform compliance, and send reports.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" onClick={() => navigate("/login")}>
            Sign In
          </Button>
          <Button variant="outline" className="w-full" onClick={() => navigate("/signup")}>
            Create Account
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
};

export default Index;