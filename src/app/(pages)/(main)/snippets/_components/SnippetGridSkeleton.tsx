import { ScrollArea } from '@/components/ui/scroll-area';

function SnippetGridSkeleton() {
  return (
    <ScrollArea className="h-[600px]">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
          >
            <div className="h-48 rounded-t-lg bg-gray-300 dark:bg-gray-600"></div>
            <div className="p-4">
              <div className="mb-2 h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-600"></div>
              <div className="h-4 w-1/2 rounded bg-gray-300 dark:bg-gray-600"></div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

export default SnippetGridSkeleton;
