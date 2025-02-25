import React from 'react';
import {
  Carousel as CarouselComponent,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const images = [
  {
    url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1600&h=600&q=80',
    title: 'Premium Sports Facilities',
    subtitle: 'Book your next game in our world-class courts',
  },
  {
    url: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=1600&h=600&q=80',
    title: 'Multiple Sports Available',
    subtitle: 'Football, Volleyball, Pickle Ball and more',
  },
  {
    url: 'https://images.unsplash.com/photo-1628891890467-b79de81a0c66?auto=format&fit=crop&w=1600&h=600&q=80',
    title: 'Easy Booking Process',
    subtitle: 'Reserve your court in minutes',
  },
];

const Carousel = () => {
  return (
    <div className="w-full mt-16">
      <CarouselComponent className="relative">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[60vh] w-full overflow-hidden rounded-lg">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white">
                  <h2 className="text-4xl font-heading font-bold mb-4">{image.title}</h2>
                  <p className="text-xl">{image.subtitle}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2" />
        <CarouselNext className="absolute right-4 top-1/2" />
      </CarouselComponent>
    </div>
  );
};

export default Carousel;
