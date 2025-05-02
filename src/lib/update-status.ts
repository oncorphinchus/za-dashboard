/**
 * Updates the server status in the UI without showing toast notifications
 * 
 * @param serverId The ID of the server to update
 * @param isOnline Whether the server is online
 * @param setServerStatusMap The state setter for the server status map
 */
export function updateServerStatus(
  serverId: string, 
  isOnline: boolean, 
  setServerStatusMap: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
) {
  // Update the server status map
  setServerStatusMap((prev) => ({
    ...prev,
    [serverId]: isOnline
  }));
} 