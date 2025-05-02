import { ServerConfig, ServerStatus } from '@/types/wireguard';

// Options for fetch requests
const fetchOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
  // These options help with handling requests in Next.js
  cache: 'no-store' as const,
  next: { 
    revalidate: 0,
  },
};

/**
 * Fetches all WireGuard servers from the internal API
 */
export async function getServers(): Promise<ServerConfig[]> {
  try {
    const response = await fetch('/api/servers', fetchOptions);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch servers: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching servers:', error);
    throw error;
  }
}

/**
 * Fetches status for a specific WireGuard server
 */
export async function getServerStatus(serverId: string): Promise<ServerStatus> {
  try {
    const response = await fetch(`/api/servers/${serverId}/status`, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch server status: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error fetching status for server ${serverId}:`, error);
    throw error;
  }
}

/**
 * Adds a new peer to a WireGuard server
 */
export async function addPeer(serverId: string, description: string) {
  try {
    const response = await fetch(`/api/servers/${serverId}/peers`, {
      ...fetchOptions,
      method: 'POST',
      body: JSON.stringify({ description }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add peer: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error adding peer to server ${serverId}:`, error);
    throw error;
  }
}

/**
 * Removes a peer from a WireGuard server
 */
export async function removePeer(serverId: string, peerPublicKey: string) {
  try {
    const response = await fetch(`/api/servers/${serverId}/peers/${encodeURIComponent(peerPublicKey)}`, {
      ...fetchOptions,
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to remove peer: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error removing peer ${peerPublicKey} from server ${serverId}:`, error);
    throw error;
  }
}

/**
 * Gets the configuration for a peer
 */
export async function getPeerConfig(serverId: string, peerPublicKey: string) {
  try {
    const response = await fetch(`/api/servers/${serverId}/peers/${encodeURIComponent(peerPublicKey)}/config`, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`Failed to get peer configuration: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error getting config for peer ${peerPublicKey} on server ${serverId}:`, error);
    throw error;
  }
} 