import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2 } from "lucide-react";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    attendanceStartTime: "08:00",
    attendanceEndTime: "09:00",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {

        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock settings already set in state
      } catch (error) {
        console.error("Error fetching settings:", error);
        toast({
          title: "Error",
          description: "Failed to load settings. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Success",
        description: "Settings saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteAllRecords = async () => {
    try {

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Success",
        description: "All previous records have been deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete records. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">
            Configure system-wide settings
          </p>
        </div>
        
        <Separator />
        
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Settings</CardTitle>
                <CardDescription>
                  Configure when attendance can be taken
                </CardDescription>
              </CardHeader>
              <form onSubmit={saveSettings}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="attendanceStartTime">Start Time</Label>
                      <Input
                        id="attendanceStartTime"
                        name="attendanceStartTime"
                        type="time"
                        value={settings.attendanceStartTime}
                        onChange={handleInputChange}
                        disabled={saving}
                      />
                      <p className="text-xs text-muted-foreground">
                        Teachers can start taking attendance at this time
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="attendanceEndTime">End Time</Label>
                      <Input
                        id="attendanceEndTime"
                        name="attendanceEndTime"
                        type="time"
                        value={settings.attendanceEndTime}
                        onChange={handleInputChange}
                        disabled={saving}
                      />
                      <p className="text-xs text-muted-foreground">
                        Teachers must complete attendance by this time
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Settings"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                  Manage system data and records
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md bg-destructive/10 p-4">
                  <div className="flex items-start">
                    <Trash2 className="mr-3 h-5 w-5 text-destructive" />
                    <div>
                      <h3 className="font-medium text-destructive">Delete Previous Records</h3>
                      <p className="text-sm text-muted-foreground">
                        This will permanently delete all attendance records and reports from previous school years.
                        This action cannot be undone.
                      </p>
                      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="mt-4">
                            Delete All Previous Records
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete all attendance records,
                              uniform compliance data, and reports from previous school years.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={deleteAllRecords}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Yes, Delete Everything
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;