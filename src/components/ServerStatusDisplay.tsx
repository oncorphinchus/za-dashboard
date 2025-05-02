'use client';

import { useEffect, useState } from 'react';
import { getServerStatus } from '@/lib/serverApi';
import { ServerStatus, WireguardPeer } from '@/types/wireguard';
import { formatBytes, formatDate } from '@/lib/utils';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddPeerButton } from '@/components/AddPeerButton';
import { RemovePeerButton } from '@/components/RemovePeerButton';
import { PeerQRCodeButton } from '@/components/PeerQRCodeButton';

interface ServerStatusDisplayProps {
  serverId: string;
  onStatusChange?: (isOnline: boolean) => void;
}

export default function ServerStatusDisplay({ serverId, onStatusChange }: ServerStatusDisplayProps) {
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServerStatus = async () => {
    if (!serverId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getServerStatus(serverId);
      setServerStatus(data);
      onStatusChange?.(true); // Notify parent that server is online
    } catch (err) {
      setError('Failed to load server status. Please try again.');
      console.error(`Error fetching status for server ${serverId}:`, err);
      onStatusChange?.(false); // Notify parent that server is offline
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServerStatus();
    
    // Set up polling every 30 seconds
    const intervalId = setInterval(fetchServerStatus, 30000);
    
    return () => clearInterval(intervalId);
  }, [serverId, onStatusChange]);

  if (!serverId) {
    return (
      <div className="p-6 text-text-primary-on-light">
        <p>Select a server to view its status.</p>
      </div>
    );
  }

  if (loading && !serverStatus) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader className="animate-pulse">
            <div className="h-6 bg-alabaster-hover rounded w-1/3 mb-4"></div>
          </CardHeader>
          <CardContent className="animate-pulse">
            <div className="h-4 bg-alabaster-hover rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-alabaster-hover rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-alabaster-hover rounded w-1/4 mb-2"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !serverStatus) {
    return (
      <div className="p-6">
        <Card className="border-error-rose bg-error-rose/5">
          <CardHeader>
            <CardTitle className="text-error-rose">Connection Error</CardTitle>
            <CardDescription>Could not connect to server</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {serverStatus && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{serverStatus.name} Interface Details</CardTitle>
              <CardDescription>Configuration information for this WireGuard interface</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-text-secondary-on-light">Public Key</h3>
                  <p className="font-mono text-sm break-all">{serverStatus.status.publicKey}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-text-secondary-on-light">Listen Port</h3>
                  <p>{serverStatus.status.listenPort}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Peers</CardTitle>
                <CardDescription>Connected WireGuard peers</CardDescription>
              </div>
              <AddPeerButton serverId={serverId} onSuccess={fetchServerStatus} />
            </CardHeader>
            <CardContent>
              {serverStatus.status.peers && serverStatus.status.peers.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>List of connected WireGuard peers.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Public Key</TableHead>
                        <TableHead>Endpoint</TableHead>
                        <TableHead>Allowed IPs</TableHead>
                        <TableHead>Latest Handshake</TableHead>
                        <TableHead>Transfer (RX/TX)</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {serverStatus.status.peers.map((peer: WireguardPeer) => (
                        <TableRow key={peer.publicKey}>
                          <TableCell className="font-mono text-xs break-all">
                            {peer.publicKey.substring(0, 16)}...
                          </TableCell>
                          <TableCell>{peer.endpoint || 'N/A'}</TableCell>
                          <TableCell>{peer.allowedIps.join(', ')}</TableCell>
                          <TableCell>
                            {peer.latestHandshake 
                              ? formatDate(peer.latestHandshake) 
                              : 'Never'}
                          </TableCell>
                          <TableCell>
                            {formatBytes(peer.transferRx)} / {formatBytes(peer.transferTx)}
                          </TableCell>
                          <TableCell className="text-right flex justify-end items-center">
                            <PeerQRCodeButton 
                              serverId={serverId} 
                              peerPublicKey={peer.publicKey} 
                            />
                            <RemovePeerButton 
                              serverId={serverId} 
                              peerPublicKey={peer.publicKey} 
                              onSuccess={fetchServerStatus}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-text-secondary-on-light mb-4">No peers connected.</p>
                  <p className="text-sm text-text-secondary-on-light">
                    Add a peer using the "Add Peer" button above to get started.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
} 