
import React, { useState, useEffect } from 'react';
import { Moon, Sun, Bell, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Settings {
  theme: 'light' | 'dark';
  defaultReminderTime: number;
  notificationsEnabled: boolean;
}

interface SettingsPageProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ settings, onSettingsChange }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    onSettingsChange(localSettings);
  };

  const reminderOptions = [
    { value: 5, label: '5 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 1440, label: '1 day' },
  ];

  return (
    <div className="p-4 pb-20 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="w-5 h-5" />
            App Theme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={localSettings.theme === 'light' ? 'default' : 'outline'}
              onClick={() => setLocalSettings({ ...localSettings, theme: 'light' })}
              className="flex-1"
            >
              <Sun className="w-4 h-4 mr-2" />
              Light
            </Button>
            <Button
              variant={localSettings.theme === 'dark' ? 'default' : 'outline'}
              onClick={() => setLocalSettings({ ...localSettings, theme: 'dark' })}
              className="flex-1"
            >
              <Moon className="w-4 h-4 mr-2" />
              Dark
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Default Reminder Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={localSettings.defaultReminderTime}
            onChange={(e) => setLocalSettings({ 
              ...localSettings, 
              defaultReminderTime: Number(e.target.value) 
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {reminderOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} before
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Enable push notifications</span>
            <Button
              variant={localSettings.notificationsEnabled ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLocalSettings({ 
                ...localSettings, 
                notificationsEnabled: !localSettings.notificationsEnabled 
              })}
            >
              {localSettings.notificationsEnabled ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={handleSave}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        Save Settings
      </Button>
    </div>
  );
};

export default SettingsPage;
