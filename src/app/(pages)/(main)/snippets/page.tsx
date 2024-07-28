'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { Edit, Plus, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// This would typically come from your API
interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  createdAt: string;
}

export default function SnippetsPage() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [isNewSnippetDialogOpen, setIsNewSnippetDialogOpen] = useState(false);
  const [newSnippet, setNewSnippet] = useState({
    title: '',
    code: '',
    language: '',
  });
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth?.user) {
      router.push('/login');
    } else {
      // Fetch snippets from your API
      fetchSnippets();
    }
  }, [auth, router]);

  const fetchSnippets = async () => {
    // This would be replaced with an actual API call
    const mockSnippets: Snippet[] = [
      {
        id: '1',
        title: 'Hello World',
        code: 'console.log("Hello World!");',
        language: 'javascript',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Fizz Buzz',
        code: 'for (let i = 1; i <= 100; i++) {\n  if (i % 15 === 0) console.log("FizzBuzz");\n  else if (i % 3 === 0) console.log("Fizz");\n  else if (i % 5 === 0) console.log("Buzz");\n  else console.log(i);\n}',
        language: 'javascript',
        createdAt: new Date().toISOString(),
      },
    ];
    setSnippets(mockSnippets);
  };

  const handleCreateSnippet = async () => {
    // This would be replaced with an actual API call
    const newSnippetWithId = {
      ...newSnippet,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setSnippets([...snippets, newSnippetWithId]);
    setNewSnippet({ title: '', code: '', language: '' });
    setIsNewSnippetDialogOpen(false);
  };

  const handleDeleteSnippet = async (id: string) => {
    // This would be replaced with an actual API call
    setSnippets(snippets.filter(snippet => snippet.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Snippets</h1>
        <Dialog
          open={isNewSnippetDialogOpen}
          onOpenChange={setIsNewSnippetDialogOpen}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Snippet
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Snippet</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  className="col-span-3"
                  value={newSnippet.title}
                  onChange={e =>
                    setNewSnippet({ ...newSnippet, title: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="language" className="text-right">
                  Language
                </Label>
                <Input
                  id="language"
                  className="col-span-3"
                  value={newSnippet.language}
                  onChange={e =>
                    setNewSnippet({ ...newSnippet, language: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">
                  Code
                </Label>
                <Textarea
                  id="code"
                  className="col-span-3"
                  rows={5}
                  value={newSnippet.code}
                  onChange={e =>
                    setNewSnippet({ ...newSnippet, code: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateSnippet}>Create Snippet</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {snippets.map(snippet => (
          <Card key={snippet.id}>
            <CardHeader>
              <CardTitle>{snippet.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded bg-gray-100 p-2">
                <code>{snippet.code}</code>
              </pre>
              <p className="mt-2 text-sm text-gray-500">
                Language: {snippet.language}
              </p>
              <p className="text-sm text-gray-500">
                Created: {new Date(snippet.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteSnippet(snippet.id)}
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
