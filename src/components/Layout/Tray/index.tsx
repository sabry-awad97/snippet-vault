import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/tauri';
import { BarChart2, Bell, Clock, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const TrayManager = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const unlistenNotification = listen<number>('notification_sent', event => {
      setNotificationCount(event.payload);
    });

    return () => {
      unlistenNotification.then(unlisten => unlisten());
    };
  }, []);

  const handleToggleWindow = () => {
    invoke('toggle_window');
  };

  const handleShowTime = () => {
    invoke('show_time');
  };

  const handleSendNotification = () => {
    invoke('send_notification');
  };

  const handleShowStats = () => {
    invoke('show_stats');
  };

  const handleToggleSound = () => {
    invoke('change_notification_settings').then(() => {
      setSoundEnabled(!soundEnabled);
    });
  };

  const handleQuit = () => {
    invoke('quit');
  };

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Tray Manager</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleToggleWindow} className="w-full">
          Toggle Window
        </Button>
        <Button onClick={handleShowTime} className="w-full">
          <Clock className="mr-2 h-4 w-4" /> Show Time
        </Button>
        <Button onClick={handleSendNotification} className="w-full">
          <Bell className="mr-2 h-4 w-4" /> Send Notification
        </Button>
        <Button onClick={handleShowStats} className="w-full">
          <BarChart2 className="mr-2 h-4 w-4" /> Show Stats
        </Button>
        <div className="flex items-center justify-between">
          <span>Notification Sound</span>
          <Switch checked={soundEnabled} onCheckedChange={handleToggleSound} />
        </div>
        <Button onClick={handleQuit} variant="destructive" className="w-full">
          <X className="mr-2 h-4 w-4" /> Quit
        </Button>
        <div className="text-sm text-gray-500">
          Notifications sent: {notificationCount}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrayManager;
