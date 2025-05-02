'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { removePeer } from '@/lib/serverApi';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

interface RemovePeerButtonProps {
  serverId: string;
  peerPublicKey: string;
  peerName?: string; // Optional friendly name to display
  onSuccess?: () => void; // Callback to refresh server status
}

export function RemovePeerButton({ 
  serverId, 
  peerPublicKey, 
  peerName, 
  onSuccess 
}: RemovePeerButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const displayName = peerName || `${peerPublicKey.substring(0, 8)}...`;

  const handleRemove = async () => {
    setIsLoading(true);

    try {
      await removePeer(serverId, peerPublicKey);
      toast({
        title: 'Peer removed successfully',
        description: 'The peer has been removed from the server',
        variant: 'default',
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error removing peer:', err);
      toast({
        title: 'Error removing peer',
        description: 'There was a problem removing the peer',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        variant="destructive"
        size="sm"
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Remove peer</span>
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will remove the peer <strong>{displayName}</strong> from the server. 
              This is permanent and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleRemove();
              }}
              className="bg-error-rose hover:bg-error-rose/90"
              disabled={isLoading}
            >
              {isLoading ? 'Removing...' : 'Remove Peer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 