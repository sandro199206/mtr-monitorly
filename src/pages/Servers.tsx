/**
 * Server Management Page
 * CRUD operations for server configuration
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Trash2, Edit, TestTube } from 'lucide-react';

export default function Servers() {
  const [servers, setServers] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingServer, setEditingServer] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    host: '',
    port: 22,
    username: '',
    auth_type: 'password',
    password: '',
    location: '',
  });

  useEffect(() => {
    loadServers();
  }, []);

  const loadServers = async () => {
    try {
      const data = await apiClient.getServers();
      setServers(data);
    } catch (error) {
      toast.error('Failed to load servers');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingServer) {
        await apiClient.updateServer(editingServer.id, formData);
        toast.success('Server updated!');
      } else {
        await apiClient.createServer(formData);
        toast.success('Server created!');
      }
      setIsOpen(false);
      resetForm();
      loadServers();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;

    try {
      await apiClient.deleteServer(id);
      toast.success('Server deleted');
      loadServers();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleTest = async (id: number) => {
    try {
      const result = await apiClient.testServerConnection(id);
      toast[result.success ? 'success' : 'error'](result.message);
    } catch (error: any) {
      toast.error('Connection test failed');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      host: '',
      port: 22,
      username: '',
      auth_type: 'password',
      password: '',
      location: '',
    });
    setEditingServer(null);
  };

  const openEditDialog = (server: any) => {
    setEditingServer(server);
    setFormData({
      name: server.name,
      host: server.host,
      port: server.port,
      username: server.username,
      auth_type: server.auth_type,
      password: '',
      location: server.location || '',
    });
    setIsOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Server Management</h1>
          <Link to="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">Manage your MTR servers</p>
          <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>Add Server</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingServer ? 'Edit Server' : 'Add Server'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div>
                  <Label>Host</Label>
                  <Input value={formData.host} onChange={(e) => setFormData({...formData, host: e.target.value})} required />
                </div>
                <div>
                  <Label>Port</Label>
                  <Input type="number" value={formData.port} onChange={(e) => setFormData({...formData, port: parseInt(e.target.value)})} required />
                </div>
                <div>
                  <Label>Username</Label>
                  <Input value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Leave empty to keep current" />
                </div>
                <div>
                  <Label>Location (optional)</Label>
                  <Input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="e.g., US East" />
                </div>
                <Button type="submit" className="w-full">{editingServer ? 'Update' : 'Create'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {servers.map((server) => (
            <Card key={server.id}>
              <CardHeader>
                <CardTitle>{server.name}</CardTitle>
                <CardDescription>{server.location || server.host}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1 mb-4">
                  <div><span className="text-muted-foreground">Host:</span> {server.host}:{server.port}</div>
                  <div><span className="text-muted-foreground">User:</span> {server.username}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleTest(server.id)}>
                    <TestTube className="w-4 h-4 mr-1" /> Test
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => openEditDialog(server)}>
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(server.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {servers.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">No servers configured yet</p>
              <Button onClick={() => setIsOpen(true)}>Add Your First Server</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
