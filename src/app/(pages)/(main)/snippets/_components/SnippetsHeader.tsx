import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import useSnippets from '@/hooks/useSnippetsContext';
import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import React from 'react';

const languages = [
  { value: 'all', label: 'All Languages' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'rust', label: 'Rust' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
];

const SnippetsHeader: React.FC = () => {
  const { handleLanguageChange, handleDateRangeChange, handleFavoriteToggle } =
    useSnippets();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-4">
          <div className="ml-auto flex items-center justify-center gap-5">
            <DateRangePicker
              onUpdate={values => {

                if (values.range.from && values.range.to) {
                  handleDateRangeChange({
                    from: values.range.from,
                    to: values.range.to,
                  });
                }
              }}
              initialDateFrom={
                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000 /* 30 days ago*/)
              }
              initialDateTo={new Date()}
              align="start"
              locale="en-GB"
              showCompare={false}
            />

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-10 p-0">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72" align="end">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">
                      Advanced Filters
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Customize your snippet with advanced filters.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Select
                      onValueChange={handleLanguageChange}
                      defaultValue="all"
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map(lang => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-favorites"
                        onCheckedChange={handleFavoriteToggle}
                      />
                      <Label htmlFor="show-favorites">
                        Show Favorites Only
                      </Label>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SnippetsHeader;
