// components/ui/tooltip.tsx
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { FC, ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
  delayDuration?: number;
  sideOffset?: number;
  className?: string;
  gradient?: boolean; // New prop to enable gradient background
}

export const Tooltip: FC<TooltipProps> = ({
  children,
  content,
  delayDuration = 0,
  sideOffset = 5,
  className = '',
}) => {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          className={`rounded bg-gradient-to-r from-purple-500 to-indigo-500 px-2 py-1 text-xs text-white ${className}`}
          sideOffset={sideOffset}
        >
          {content}
          <TooltipPrimitive.Arrow className="text-gradient-to-r from-purple-500 to-indigo-500 fill-current" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};
