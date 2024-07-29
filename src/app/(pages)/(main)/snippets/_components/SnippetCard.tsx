import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Snippet } from '@/lib/schemas/snippet';
import { Code, Copy, Edit, Trash2 } from 'lucide-react';
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface SnippetCardProps {
  snippet: Snippet;
  onDelete: () => void;
  onCopy: () => void;
  onEdit: () => void;
}

const SnippetCard: React.FC<SnippetCardProps> = ({
  snippet,
  onDelete,
  onCopy,
  onEdit,
}) => {
  return (
    <Card className="overflow-hidden border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader className="bg-gray-50 p-4">
        <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
          <Code className="mr-2 h-5 w-5 text-blue-600" />
          {snippet.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="max-h-48 overflow-y-auto rounded-md">
          <SyntaxHighlighter
            language={snippet.language}
            style={vscDarkPlus}
            showLineNumbers
          >
            {snippet.code}
          </SyntaxHighlighter>
        </div>
        <p className="mt-3 text-sm font-medium text-gray-600">
          Language: <span className="text-blue-600">{snippet.language}</span>
        </p>
        <p className="text-sm text-gray-500">
          Created: {new Date(snippet.createdAt).toLocaleDateString()}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 bg-gray-50 p-4">
        <Button variant="outline" size="sm" onClick={onCopy}>
          <Copy className="mr-2 h-4 w-4" /> Copy
        </Button>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SnippetCard;
