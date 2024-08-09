import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import useCurrentTheme from '@/hooks/useCurrentTheme';
import useLanguageStore from '@/hooks/useLanguageStore';
import { useMonacoThemeManager } from '@/hooks/useMonacoThemeManager';
import { Snippet, SnippetSchema } from '@/lib/schemas/snippet';
import { cn } from '@/lib/utils';
import { titleCase } from '@/lib/utils/stringUtils';
import { zodResolver } from '@hookform/resolvers/zod';
import Editor from '@monaco-editor/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { SubmitErrorHandler, useForm } from 'react-hook-form';
import { FiPlus, FiSave } from 'react-icons/fi';
import { toast } from 'sonner';
import TagInput from './TagInput';

interface SnippetFormProps {
  snippet?: Snippet;
  onSubmit: (snippet: Snippet) => Promise<void>;
}

const useDarkMode = ({
  snippet,
  theme,
}: {
  snippet?: Snippet;
  theme?: string;
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isSnippetDark = snippet?.state?.isDark ?? false;
    const isThemeDark = theme === 'dark';

    if (snippet) {
      if (isSnippetDark) {
        return setIsDarkMode(true);
      }
      return setIsDarkMode(false);
    }

    return setIsDarkMode(isThemeDark);
  }, [snippet, theme]);

  return isDarkMode;
};

const SnippetForm: React.FC<SnippetFormProps> = ({ snippet, onSubmit }) => {
  const form = useForm<Snippet>({
    resolver: zodResolver(SnippetSchema),
    defaultValues: snippet || {
      title: '',
      description: '',
      language: '',
      code: '',
      tags: [],
      state: {
        id: '',
        isFavorite: false,
        isDark: false,
      },
      tagIds: [],
      snippetStateId: '',
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const { handleEditorDidMount } = useMonacoThemeManager();
  const { theme } = useCurrentTheme();
  const isDarkMode = useDarkMode({ snippet, theme });
  const { languages } = useLanguageStore();

  const handleSubmit = async (values: Snippet) => {
    await onSubmit({
      ...values,
      tagIds: values.tags?.map(tag => tag.id) || [],
    });
  };

  const onInvalid: SubmitErrorHandler<Snippet> = errors => {
    console.log({ errors });

    Object.values(errors).forEach(error => {
      toast.error(error?.message?.toString());
    });
    setTimeout(() => form.clearErrors(), 3000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'rounded-lg p-8 shadow-lg',
          isDarkMode
            ? 'bg-gradient-to-br from-gray-800 to-gray-900'
            : 'bg-gradient-to-br from-purple-50 to-indigo-50',
        )}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit, onInvalid)}
            className="space-y-6"
            autoComplete="off"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-6">
                {/* Title Field */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={cn(
                          'font-semibold',
                          isDarkMode ? 'text-purple-300' : 'text-purple-700',
                        )}
                      >
                        Title
                      </FormLabel>
                      <FormControl>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Input
                            {...field}
                            className={cn(
                              'w-full rounded-md border-2 px-4 py-2 transition-all duration-200',
                              isDarkMode
                                ? 'border-purple-700 bg-gray-800 text-white hover:border-purple-500 focus:border-purple-400 focus:ring-purple-400'
                                : 'border-purple-200 bg-white hover:border-purple-400 focus:border-purple-500 focus:ring-purple-300',
                              'focus:outline-none focus:ring-2',
                            )}
                          />
                        </motion.div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={cn(
                          'font-semibold',
                          isDarkMode ? 'text-purple-300' : 'text-purple-700',
                        )}
                      >
                        Description
                      </FormLabel>
                      <FormControl>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Textarea
                            {...field}
                            className={cn(
                              'w-full rounded-md border-2 px-4 py-2 transition-all duration-200',
                              isDarkMode
                                ? 'border-purple-700 bg-gray-800 text-white hover:border-purple-500 focus:border-purple-400 focus:ring-purple-400'
                                : 'border-purple-200 bg-white hover:border-purple-400 focus:border-purple-500 focus:ring-purple-300',
                              'focus:outline-none focus:ring-2',
                            )}
                          />
                        </motion.div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Language Field */}
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={cn(
                          'font-semibold',
                          isDarkMode ? 'text-purple-300' : 'text-purple-700',
                        )}
                      >
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
                            <SelectTrigger
                              className={cn(
                                'w-full rounded-md border-2 px-4 py-2 transition-all duration-200',
                                isDarkMode
                                  ? 'border-purple-700 bg-gray-800 text-white hover:border-purple-500 focus:border-purple-400 focus:ring-purple-400'
                                  : 'border-purple-200 bg-white hover:border-purple-400 focus:border-purple-500 focus:ring-purple-300',
                                'focus:outline-none focus:ring-2',
                              )}
                            >
                              <SelectValue placeholder="Select a language" />
                            </SelectTrigger>
                          </motion.div>
                        </FormControl>
                        <SelectContent>
                          {languages.map(lang => (
                            <SelectItem key={lang.name} value={lang.name}>
                              {titleCase(lang.name)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Tags Field */}
                <FormItem>
                  <FormLabel
                    className={cn(
                      'font-semibold',
                      isDarkMode ? 'text-purple-300' : 'text-purple-700',
                    )}
                  >
                    Tags
                  </FormLabel>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <TagInput isDarkMode={isDarkMode} />
                  </motion.div>
                </FormItem>

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="submit"
                    className={cn(
                      'w-full rounded-md py-2 font-semibold text-white shadow-md transition-all duration-200 focus:ring-2 focus:ring-offset-2',
                      isDarkMode
                        ? 'bg-purple-700 hover:bg-purple-600 focus:ring-purple-400'
                        : 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500',
                    )}
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

              {/* Code Editor Field */}
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="h-full">
                      <FormLabel
                        className={cn(
                          'font-semibold',
                          isDarkMode ? 'text-purple-300' : 'text-purple-700',
                        )}
                      >
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
                            onMount={handleEditorDidMount}
                            height="100%"
                            language={
                              form.getValues('language') || 'javascript'
                            }
                            defaultLanguage={'typescript'}
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
                            }}
                            theme={isDarkMode ? 'vs-dark' : 'vs'}
                            className={cn(
                              'overflow-hidden rounded-md border-2 transition-all duration-200',
                              isDarkMode
                                ? 'border-purple-700 focus-within:border-purple-400 focus-within:ring-purple-400 hover:border-purple-500'
                                : 'border-purple-200 focus-within:border-purple-500 focus-within:ring-purple-300 hover:border-purple-400',
                              'focus-within:ring-2',
                            )}
                          />
                        </motion.div>
                      </FormControl>
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
