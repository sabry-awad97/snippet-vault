import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { FC, ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
  delayDuration?: number;
  sideOffset?: number;
  className?: string;
  gradient?: boolean;
  side?: 'top' | 'right' | 'bottom' | 'left'; // New prop for specifying the side
}

export const Tooltip: FC<TooltipProps> = ({
  children,
  content,
  delayDuration = 0,
  sideOffset = 5,
  className = '',
  gradient = true,
  side = 'top', // Default value for side
}) => {
  const gradientClass = gradient
    ? 'bg-gradient-to-r from-purple-500 to-indigo-500'
    : 'bg-gray-800';

  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          className={`rounded ${gradientClass} px-2 py-1 text-xs text-white ${className}`}
          sideOffset={sideOffset}
          side={side}
        >
          {content}
          <TooltipPrimitive.Arrow
            className={gradient ? 'fill-purple-500' : 'fill-gray-800'}
          />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};
