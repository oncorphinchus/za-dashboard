'use client';

import { useEffect, useState } from 'react';
import { getServers } from '@/lib/serverApi';
import { ServerConfig } from '@/types/wireguard';
import { cn } from '@/lib/utils';

interface ServerListProps {
  onSelectServer: (server: ServerConfig) => void;
  selectedServerId?: string;
  serverStatusMap?: Record<string, boolean>;
}

export default function ServerList({ 
  onSelectServer, 
  selectedServerId,
  serverStatusMap = {} 
}: ServerListProps) {
  const [servers, setServers] = useState<ServerConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServers() {
      try {
        setLoading(true);
        setError(null);
        const data = await getServers();
        setServers(data);
      } catch (err) {
        setError('Failed to load servers. Please try again.');
        console.error('Error fetching servers:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchServers();
  }, []);

  // Function to get the status indicator color for a server
  const getStatusIndicatorClass = (serverId: string): string => {
    if (serverId in serverStatusMap) {
      return serverStatusMap[serverId] 
        ? 'bg-success-green' // Online
        : 'bg-error-rose';   // Error/Offline
    }
    return 'bg-stone-border-light'; // Unknown/Not checked yet
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-text-primary-on-dark mb-4">Servers</h2>
      
      {loading && (
        <p className="text-text-secondary-on-dark">Loading servers...</p>
      )}
      
      {error && (
        <div className="bg-error-rose bg-opacity-20 p-3 rounded text-text-primary-on-dark border border-error-rose border-opacity-50">
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {!loading && !error && servers.length === 0 && (
        <p className="text-text-secondary-on-dark">No servers found.</p>
      )}
      
      <ul className="space-y-1 mt-4">
        {servers.map((server) => (
          <li key={server.id}>
            <button
              onClick={() => onSelectServer(server)}
              className={cn(
                'w-full text-left px-3 py-2 rounded transition-colors',
                'flex items-center',
                selectedServerId === server.id 
                  ? 'bg-slate-interactive text-text-primary-on-dark' 
                  : 'text-text-secondary-on-dark hover:bg-graphite-border hover:text-text-primary-on-dark'
              )}
              aria-pressed={selectedServerId === server.id}
            >
              {/* Status indicator dot */}
              <span 
                className={cn("w-2 h-2 rounded-full mr-2 transition-colors", 
                  getStatusIndicatorClass(server.id)
                )}
                aria-hidden="true"
              ></span>
              <span className="truncate">{server.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
} 