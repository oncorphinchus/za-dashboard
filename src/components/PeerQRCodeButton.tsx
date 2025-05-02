'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { getPeerConfig } from '@/lib/serverApi';
import { useToast } from '@/hooks/use-toast';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode } from 'lucide-react';

interface PeerQRCodeButtonProps {
  serverId: string;
  peerPublicKey: string;
  peerName?: string; // Optional friendly name to display
}

export function PeerQRCodeButton({ 
  serverId, 
  peerPublicKey, 
  peerName 
}: PeerQRCodeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const displayName = peerName || `${peerPublicKey.substring(0, 8)}...`;

  const fetchConfig = async () => {
    if (config) return; // Already fetched
    
    setIsLoading(true);
    setError(null);

    try {
      const data = await getPeerConfig(serverId, peerPublicKey);
      setConfig(data.config || '');
    } catch (err) {
      console.error('Error fetching peer config:', err);
      setError('Failed to fetch peer configuration.');
      toast({
        title: 'Error',
        description: 'Failed to load peer configuration.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      fetchConfig();
    }
  };

  return (
    <>
      <Button 
        onClick={() => handleOpenChange(true)} 
        variant="outline"
        size="sm"
        className="ml-2"
      >
        <QrCode className="h-4 w-4" />
        <span className="sr-only">Show QR Code</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Peer Configuration QR Code</DialogTitle>
            <DialogDescription>
              Scan this QR code with the WireGuard app on your device.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center p-4">
            {isLoading && (
              <div className="flex items-center justify-center w-64 h-64 bg-alabaster-hover animate-pulse rounded">
                <span className="text-text-secondary-on-light">Loading...</span>
              </div>
            )}
            
            {error && (
              <div className="text-error-rose mt-2 text-center">
                <p>{error}</p>
              </div>
            )}
            
            {!isLoading && !error && config && (
              <div className="p-4 bg-white rounded">
                <QRCodeSVG 
                  value={config} 
                  size={256}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  level="M"
                  includeMargin={true}
                />
              </div>
            )}
            
            <div className="mt-4 text-center">
              <p className="text-sm text-text-secondary-on-light">
                Peer: {displayName}
              </p>
            </div>
          </div>
          
          <div className="flex justify-center mt-4">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 