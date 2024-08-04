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
import React from 'react';
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialTag || {
      name: '',
      color: '#f7df1e',
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1, duration: 0.3 }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
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
                      isDarkMode
                        ? 'border-purple-700 bg-gray-800 text-white hover:border-purple-500 focus:border-purple-400 focus:ring-purple-400'
                        : 'border-purple-200 bg-white hover:border-purple-400 focus:border-purple-500 focus:ring-purple-300',
                      'focus:outline-none focus:ring-2',
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
