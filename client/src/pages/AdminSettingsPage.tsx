import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminBackupButton } from "@/components/AdminBackupButton";
import MainLayout from "@/layouts/MainLayout";
import { Calendar, FileArchive, RefreshCw, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminSettingsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage system settings and perform administrative tasks.
            </p>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Backup & Recovery</CardTitle>
                  <FileArchive className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>
                  Manage system backups and data recovery options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <h3 className="font-medium">Automated Backups</h3>
                    <p className="text-sm text-muted-foreground">
                      Daily backups are scheduled at 6:00 PM UTC
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Next scheduled: Today at 6:00 PM UTC</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Frequency: Daily</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex flex-col space-y-2">
                    <h3 className="font-medium">Manual Backup</h3>
                    <p className="text-sm text-muted-foreground">
                      Trigger an immediate backup of all system data
                    </p>
                    <div className="mt-2">
                      <AdminBackupButton />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">System Status</CardTitle>
                  <Shield className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>
                  Current system status and information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">System Status</span>
                      <Badge className="bg-green-500 hover:bg-green-600">Operational</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">API Connection</span>
                      <Badge className="bg-green-500 hover:bg-green-600">Connected</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">NextMonth Dev Listener</span>
                      <Badge className="bg-green-500 hover:bg-green-600">Online</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">NextMonth Vault</span>
                      <Badge className="bg-green-500 hover:bg-green-600">Online</Badge>
                    </div>
                    
                    <Separator />
                    
                    <div className="pt-2">
                      <h3 className="font-medium mb-2">Environment Information</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Environment:</div>
                        <div>Development</div>
                        
                        <div className="text-muted-foreground">Version:</div>
                        <div>1.0.0</div>
                        
                        <div className="text-muted-foreground">Last Backup:</div>
                        <div>Pending</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}