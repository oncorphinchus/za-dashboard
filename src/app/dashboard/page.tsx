'use client';

import { useState } from 'react';
import { ServerConfig } from '@/types/wireguard';
import ServerList from '@/components/ServerList';
import ServerStatusDisplay from '@/components/ServerStatusDisplay';
import { updateServerStatus } from '@/lib/update-status';
import { useToast } from '@/hooks/use-toast';
import { WelcomeCard } from '@/components/WelcomeCard';

export default function DashboardPage() {
  const [selectedServer, setSelectedServer] = useState<ServerConfig | null>(null);
  const [serverStatusMap, setServerStatusMap] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleSelectServer = (server: ServerConfig) => {
    setSelectedServer(server);
  };

  const handleServerStatusChange = (serverId: string, isOnline: boolean) => {
    // Update status
    updateServerStatus(serverId, isOnline, setServerStatusMap);
    
    // Show toast notification
    if (selectedServer?.id === serverId) {
      if (isOnline) {
        toast({
          title: "Server Online",
          description: `Successfully connected to ${selectedServer.name}`,
          variant: "default",
        });
      } else {
        toast({
          title: "Server Offline",
          description: `Could not connect to ${selectedServer.name}`,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar with server list */}
      <div className="w-64 bg-charcoal-surface border-r border-graphite-border overflow-y-auto">
        <ServerList 
          onSelectServer={handleSelectServer}
          selectedServerId={selectedServer?.id}
          serverStatusMap={serverStatusMap}
        />
      </div>
      
      {/* Main content area */}
      <div className="flex-1 bg-ivory-paper overflow-y-auto">
        <header className="bg-onyx-bg text-text-primary-on-dark p-4 shadow-md">
          <h1 className="text-2xl font-bold">WireGuard Dashboard</h1>
        </header>
        
        <main>
          {selectedServer ? (
            <ServerStatusDisplay 
              serverId={selectedServer.id}
              onStatusChange={(isOnline) => handleServerStatusChange(selectedServer.id, isOnline)}
            />
          ) : (
            <div className="p-6">
              <WelcomeCard />
            </div>
          )}
        </main>
      </div>
    </div>
  );
} 