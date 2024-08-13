import { Tooltip } from '@/components/Common/Tooltip';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TagActionButtonProps {
  icon: React.ElementType;
  onClick: () => void;
  isActive?: boolean;
  activeColor?: string;
  tooltip: string;
  className?: string;
}

const TagActionButton: React.FC<TagActionButtonProps> = ({
  icon: Icon,
  onClick,
  isActive,
  activeColor,
  tooltip,
  className,
}) => (
  <Tooltip content={tooltip}>
    <Button
      onClick={onClick}
      size="sm"
      variant="ghost"
      className={cn(
        'z-10 transition-all duration-200 hover:scale-110',
        isActive ? activeColor : 'hover:bg-purple-200 dark:hover:bg-purple-800',
        className,
      )}
    >
      <Icon className="h-4 w-4" />
    </Button>
  </Tooltip>
);

export default TagActionButton;
