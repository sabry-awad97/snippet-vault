import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Snippet,
  SnippetFormData,
  snippetFormSchema,
} from '@/lib/schemas/snippet';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiSave } from 'react-icons/fi';
import { TagInput } from './TagInput';

interface SnippetFormProps {
  snippet?: Snippet;
  onSubmit: (snippet: Snippet) => Promise<void>;
}

const SnippetForm: React.FC<SnippetFormProps> = ({ snippet, onSubmit }) => {
  const [tags, setTags] = useState<string[]>(snippet?.tags || []);

  const form = useForm<SnippetFormData>({
    resolver: zodResolver(snippetFormSchema),
    defaultValues: snippet || {
      title: '',
      language: '',
      code: '',
      tags: [],
    },
  });

  const handleSubmit = async (values: SnippetFormData) => {
    const newSnippet: Snippet = {
      ...values,
      tags,
      id: snippet?.id || Date.now().toString(),
      createdAt: snippet?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    await onSubmit(newSnippet);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 py-6"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-700">Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="transition-all duration-200 hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                  />
                </FormControl>
                <FormMessage className="text-purple-600" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-700">Language</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="transition-all duration-200 hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="csharp">C#</SelectItem>
                    <SelectItem value="php">PHP</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-purple-600" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-700">Code</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={10}
                    className="transition-all duration-200 hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                  />
                </FormControl>
                <FormMessage className="text-purple-600" />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel className="text-purple-700">Tags</FormLabel>
            <TagInput
              tags={tags}
              setTags={setTags}
              placeholder="Add tags..."
              className="transition-all duration-200 hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
            />
          </FormItem>
          <DialogFooter className="space-x-4">
            <Button
              type="submit"
              className="bg-purple-600 text-white transition-all duration-200 hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              {snippet ? (
                <>
                  <FiSave className="mr-2" /> Update Snippet
                </>
              ) : (
                <>
                  <FiPlus className="mr-2" /> Create Snippet
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </motion.div>
  );
};

export default SnippetForm;
