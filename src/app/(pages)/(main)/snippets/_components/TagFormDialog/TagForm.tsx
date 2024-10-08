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
import { Tag } from '@/lib/schemas/tag';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import React, { useMemo } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(1, 'Tag name is required'),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
});

interface TagFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  initialTag?: Tag | null;
  isDarkMode: boolean;
}

const TagForm: React.FC<TagFormProps> = ({
  onSubmit,
  initialTag,
  isDarkMode,
}) => {
  const isEditMode = !!initialTag;

  const randomColor = useMemo(() => {
    return (
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')
    );
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialTag || {
      name: '',
      color: randomColor,
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1, duration: 0.3 }}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 p-6"
          autoComplete="off"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={cn(
                    'font-semibold',
                    isDarkMode ? 'text-purple-300' : 'text-purple-700',
                  )}
                >
                  Tag Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className={cn(
                      'w-full rounded-md border-2 px-4 py-2 transition-all duration-200',
                      {
                        'border-purple-700 bg-gray-800 text-purple-300 hover:border-purple-500 focus:border-purple-400 focus:ring-purple-400':
                          isDarkMode,
                        'border-purple-200 bg-white text-purple-700 hover:border-purple-400 focus:border-purple-500 focus:ring-purple-300':
                          !isDarkMode,
                      },
                      'focus:outline-none focus:ring-2',
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={cn(
                      'font-semibold',
                      isDarkMode ? 'text-purple-300' : 'text-purple-700',
                    )}
                  >
                    Tag Color
                  </FormLabel>
                  <FormControl>
                    <HexColorPicker
                      color={field.value}
                      onChange={field.onChange}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <div className="flex w-full space-x-2 pt-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full"
            >
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className={cn(
                  'w-full rounded-md py-2 font-semibold text-white shadow-md transition-all duration-200 focus:ring-2 focus:ring-offset-2',
                  isDarkMode
                    ? 'bg-purple-700 hover:bg-purple-600 focus:ring-purple-400'
                    : 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500',
                )}
              >
                {isEditMode ? 'Update' : 'Create'}
              </Button>
            </motion.div>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default TagForm;
