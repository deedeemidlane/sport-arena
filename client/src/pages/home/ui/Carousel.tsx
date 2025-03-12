import {
  Carousel as CarouselComponent,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const images = [
  {
    url: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1600&h=600&q=80",
    title: "Hệ thống đặt sân tập hàng đầu Việt Nam",
    subtitle: "Được ưa chuộng bởi hàng triệu người chơi",
  },
  {
    url: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=1600&h=600&q=80",
    title: "Quy trình đặt sân tập đơn giản và nhanh chóng",
    subtitle: "Đặt sân tập mong muốn chỉ trong vài bước",
  },
];

export const Carousel = () => {
  return (
    <div className="w-full">
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
                <div className="absolute bg-[#0000003b] inset-0 flex flex-col items-center justify-center text-white">
                  <h2 className="text-4xl font-heading font-bold mb-4 text-center max-md:max-w-[500px] px-10">
                    {image.title}
                  </h2>
                  <p className="text-xl text-center max-md:max-w-[400px] px-5">
                    {image.subtitle}
                  </p>
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
