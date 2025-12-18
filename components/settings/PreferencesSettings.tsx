"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Bell, Moon, Globe } from "lucide-react";

export function PreferencesSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const { toast } = useToast();

  const handlePreferenceChange = (key: string, _value: boolean | string) => {
    // In a real app, you'd save this to the database
    toast({
      title: "Preference Updated",
      description: `${key} has been updated`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Manage how you receive notifications
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="email-notifications">Email Notifications</Label>
          <p className="text-sm text-muted-foreground">
            Receive email updates about your account activity
          </p>
        </div>
        <Switch
          id="email-notifications"
          checked={emailNotifications}
          onCheckedChange={(checked) => {
            setEmailNotifications(checked);
            handlePreferenceChange("Email Notifications", checked);
          }}
        />
      </div>

      <div className="border-t pt-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Appearance
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Customize the appearance of the application
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <p className="text-sm text-muted-foreground">
              Switch to dark theme (coming soon)
            </p>
          </div>
          <Switch
            id="dark-mode"
            checked={darkMode}
            onCheckedChange={(checked) => {
              setDarkMode(checked);
              handlePreferenceChange("Dark Mode", checked);
            }}
            disabled
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Language & Region
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Choose your preferred language
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <select
            id="language"
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              handlePreferenceChange("Language", e.target.value);
            }}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
      </div>
    </div>
  );
}
