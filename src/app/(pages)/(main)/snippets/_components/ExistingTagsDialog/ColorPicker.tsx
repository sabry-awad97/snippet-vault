import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React from 'react';
import { HexColorPicker } from 'react-colorful';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  isDarkMode: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
  isDarkMode,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
    >
      <Label
        className={cn(
          'mb-2 block font-semibold',
          isDarkMode ? 'text-purple-300' : 'text-purple-700',
        )}
      >
        Color
      </Label>
      <HexColorPicker color={color} onChange={onChange} className="w-full" />
    </motion.div>
  );
};

export default ColorPicker;
