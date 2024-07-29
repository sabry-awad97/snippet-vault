import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useSnippets from '@/hooks/useSnippets';
import { Plus, Search } from 'lucide-react';

const SnippetsHeader = () => {
  const { state, dispatch } = useSnippets();

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <Button
        onClick={() =>
          dispatch({ type: 'SET_NEW_SNIPPET_DIALOG', payload: true })
        }
        className="bg-purple-600 text-white transition-all duration-200 hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      >
        <Plus className="mr-2 h-4 w-4" /> <span>New Snippet</span>
      </Button>
      <div className="flex flex-1 items-center gap-4">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search snippets..."
            className="pl-10 pr-4"
            value={state.searchTerm}
            onChange={e =>
              dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })
            }
          />
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        </div>

        <Select
          onValueChange={value =>
            dispatch({
              type: 'SET_FILTER_LANGUAGE',
              payload: value,
            })
          }
          defaultValue={state.filterLanguage}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="rust">Rust</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="csharp">C#</SelectItem>
            <SelectItem value="php">PHP</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SnippetsHeader;
