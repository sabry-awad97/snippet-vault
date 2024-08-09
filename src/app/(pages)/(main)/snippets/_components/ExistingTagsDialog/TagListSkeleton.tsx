import { cn } from '@/lib/utils';

const TagListSkeleton: React.FC = () => {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className={cn(
            'mx-2 mb-2 flex animate-pulse items-center justify-between rounded-md border border-purple-200 p-3 dark:border-purple-700',
          )}
        >
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-muted" />
            <div className="h-6 w-32 rounded bg-muted" />
          </div>
          <div className="flex space-x-2">
            <div className="h-8 w-8 rounded bg-muted" />
            <div className="h-8 w-8 rounded bg-muted" />
            <div className="h-8 w-8 rounded bg-muted" />
          </div>
        </div>
      ))}
    </>
  );
};

export default TagListSkeleton;
