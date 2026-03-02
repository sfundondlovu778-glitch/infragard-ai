import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Shield, Save } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl space-y-6">
      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-heading flex items-center gap-2">
            <User className="h-4 w-4 text-primary" /> Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Full Name</Label>
              <Input defaultValue="Admin User" className="h-9" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Email</Label>
              <Input defaultValue="admin@infraguard.ai" className="h-9" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Role</Label>
              <Input defaultValue="System Administrator" className="h-9" disabled />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Department</Label>
              <Input defaultValue="Operations" className="h-9" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-heading flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" /> Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Critical Alerts", description: "Immediate notifications for critical equipment failures", defaultChecked: true },
            { label: "Warning Alerts", description: "Notifications when parameters approach thresholds", defaultChecked: true },
            { label: "Maintenance Reminders", description: "Upcoming scheduled maintenance notifications", defaultChecked: true },
            { label: "Daily Summary", description: "Daily digest of system health and activities", defaultChecked: false },
            { label: "Report Generation", description: "Notifications when automated reports are ready", defaultChecked: false },
          ].map((pref) => (
            <div key={pref.label} className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium">{pref.label}</p>
                <p className="text-xs text-muted-foreground">{pref.description}</p>
              </div>
              <Switch defaultChecked={pref.defaultChecked} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-heading flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" /> Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Current Password</Label>
            <Input type="password" placeholder="••••••••" className="h-9 max-w-sm" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">New Password</Label>
              <Input type="password" placeholder="••••••••" className="h-9" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Confirm New Password</Label>
              <Input type="password" placeholder="••••••••" className="h-9" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="gap-2" onClick={handleSave}>
          <Save className="h-4 w-4" /> Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Settings;
