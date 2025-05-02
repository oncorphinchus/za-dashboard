import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function WelcomeCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to the WireGuard Dashboard</CardTitle>
        <CardDescription>Manage your WireGuard VPN servers</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-text-secondary-on-light">
          Select a server from the sidebar to view its status and manage its peers.
        </p>
      </CardContent>
    </Card>
  );
} 