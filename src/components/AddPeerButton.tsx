'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addPeer } from '@/lib/serverApi';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';

interface AddPeerButtonProps {
  serverId: string;
  onSuccess?: () => void; // Callback to refresh server status
}

export function AddPeerButton({ serverId, onSuccess }: AddPeerButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please enter a description for the peer.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await addPeer(serverId, description);
      setIsOpen(false);
      setDescription('');
      toast({
        title: 'Peer added successfully',
        description: 'The new peer has been created',
        variant: 'default',
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error adding peer:', err);
      setError('Failed to add peer. Please try again.');
      toast({
        title: 'Error adding peer',
        description: 'There was a problem adding the new peer',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        className="bg-willow-green-primary text-text-on-accent hover:bg-willow-green-primary/90"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Peer
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Peer</DialogTitle>
            <DialogDescription>
              Enter a description for the new peer. A public/private key pair will be generated automatically.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  placeholder="e.g. iPhone 13, John's Laptop"
                  className="col-span-3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              {error && (
                <div className="text-error-rose text-sm mt-2">{error}</div>
              )}
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || !description.trim()}
              >
                {isLoading ? 'Adding...' : 'Add Peer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
} 