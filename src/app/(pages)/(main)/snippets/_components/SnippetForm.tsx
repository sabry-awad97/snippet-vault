import { zodResolver } from '@hookform/resolvers/zod';
import Editor from '@monaco-editor/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiSave } from 'react-icons/fi';

import { Button } from '@/components/ui/button';
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
import { Snippet, snippetSchema } from '@/lib/schemas/snippet';
import { TagInput } from './TagInput';

interface SnippetFormProps {
  snippet?: Snippet;
  onSubmit: (snippet: Snippet) => Promise<void>;
}

const languages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'rust', label: 'Rust' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
];

const SnippetForm: React.FC<SnippetFormProps> = ({ snippet, onSubmit }) => {
  const [tags, setTags] = useState<string[]>(snippet?.tags || []);

  const form = useForm<Snippet>({
    resolver: zodResolver(snippetSchema),
    defaultValues: snippet || {
      title: '',
      language: '',
      code: '',
      tags: [],
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const handleSubmit = async (values: Snippet) => {
    await onSubmit({ ...values, tags });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50 p-8 shadow-lg"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-purple-700">
                        Title
                      </FormLabel>
                      <FormControl>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Input
                            {...field}
                            className="w-full rounded-md border-2 border-purple-200 bg-white px-4 py-2 transition-all duration-200 hover:border-purple-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                          />
                        </motion.div>
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
                      <FormLabel className="font-semibold text-purple-700">
                        Language
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <SelectTrigger className="w-full rounded-md border-2 border-purple-200 bg-white px-4 py-2 transition-all duration-200 hover:border-purple-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300">
                              <SelectValue placeholder="Select a language" />
                            </SelectTrigger>
                          </motion.div>
                        </FormControl>
                        <SelectContent>
                          {languages.map(lang => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-purple-600" />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel className="font-semibold text-purple-700">
                    Tags
                  </FormLabel>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <TagInput
                      tags={tags}
                      setTags={setTags}
                      placeholder="Add tags..."
                      className="w-full rounded-md border-2 border-purple-200 bg-white px-4 py-2 transition-all duration-200 hover:border-purple-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                    />
                  </motion.div>
                </FormItem>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="submit"
                    className="w-full rounded-md bg-purple-600 py-2 font-semibold text-white shadow-md transition-all duration-200 hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    {snippet ? (
                      <>
                        <FiSave className="mr-2" />
                        <span>Update Snippet</span>
                      </>
                    ) : (
                      <>
                        <FiPlus className="mr-2" />
                        <span>Create Snippet</span>
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="h-full">
                      <FormLabel className="font-semibold text-purple-700">
                        Code
                      </FormLabel>
                      <FormControl>
                        <motion.div
                          className="h-[calc(100%-2rem)]"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Editor
                            height="100%"
                            defaultLanguage={
                              form.getValues('language') || 'javascript'
                            }
                            defaultValue={field.value}
                            onChange={value => field.onChange(value || '')}
                            options={{
                              minimap: { enabled: false },
                              fontSize: 14,
                              wordWrap: 'on',
                              scrollBeyondLastLine: false,
                              lineNumbers: 'on',
                              matchBrackets: 'always',
                              automaticLayout: true,
                              theme: 'vs-dark',
                            }}
                            className="overflow-hidden rounded-md border-2 border-purple-200 transition-all duration-200 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-300 hover:border-purple-400"
                          />
                        </motion.div>
                      </FormControl>
                      <FormMessage className="text-purple-600" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </motion.div>
    </AnimatePresence>
  );
};

export default SnippetForm;
