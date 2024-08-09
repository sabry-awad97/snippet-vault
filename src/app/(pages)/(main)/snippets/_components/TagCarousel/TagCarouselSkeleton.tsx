import { Carousel, CarouselItem } from '@/components/ui/carousel';

const TagCarouselSkeleton = () => {
  return (
    <>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full px-12"
      >
        {[...Array(1)].map((_, index) => (
          <CarouselItem key={index} className="pl-2 md:basis-1/4 lg:basis-1/6">
            <div className="p-1">
              <div className="h-10 w-full animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </CarouselItem>
        ))}
      </Carousel>
    </>
  );
};

export default TagCarouselSkeleton;
