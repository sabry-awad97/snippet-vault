import { Button } from '@/components/ui/button';
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
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import useSnippets from '@/hooks/useSnippets';
import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import React, { useCallback, useState } from 'react';

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
  const { setFilter, removeFilter, clearFilters, dispatch } = useSnippets();
  const [dateRange, setDateRange] = useState<[number, number]>([0, 100]);

  const handleLanguageChange = useCallback(
    (language: string) => {
      if (language === 'all') {
        removeFilter('language');
      } else {
        setFilter({ type: 'language', value: language });
      }
    },
    [setFilter, removeFilter],
  );

  const handleFavoriteToggle = useCallback(
    (checked: boolean) => {
      if (checked) {
        setFilter({ type: 'favorite', value: true });
      } else {
        removeFilter('favorite');
      }
    },
    [setFilter, removeFilter],
  );

  const handleDateRangeChange = useCallback(
    (value: number[]) => {
      setDateRange(value as [number, number]);
      // Convert slider values to actual dates
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - value[1]);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() - value[0]);
      setFilter({ type: 'dateRange', value: [startDate, endDate] });
    },
    [setFilter],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-4">
          <Select onValueChange={handleLanguageChange} defaultValue="all">
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

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-10 p-0">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Advanced Filters</h4>
                  <p className="text-sm text-muted-foreground">
                    Customize your snippet search with advanced filters.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="date-range">Date Range</Label>
                    <Slider
                      id="date-range"
                      max={100}
                      step={1}
                      value={dateRange}
                      onValueChange={handleDateRangeChange}
                      className="col-span-2 h-4"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-favorites"
                      onCheckedChange={handleFavoriteToggle}
                    />
                    <Label htmlFor="show-favorites">Show Favorites Only</Label>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </motion.div>
  );
};

export default SnippetsHeader;
