const brands = [
  {
    name: "Nike",
    imageUrl: "https://1000logos.net/wp-content/uploads/2021/11/Nike-Logo.png",
  },
  {
    name: "Adidas",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/1200px-Adidas_Logo.svg.png",
  },
  {
    name: "Under Armour",
    imageUrl:
      "https://1000logos.net/wp-content/uploads/2021/04/Under-Armour-logo.png",
  },
  {
    name: "New Balance",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/New_Balance_logo.svg/2560px-New_Balance_logo.svg.png",
  },
  {
    name: "Reebok",
    imageUrl:
      "https://1000logos.net/wp-content/uploads/2017/05/Reebok-logo.png",
  },
];

export const BrandBanner = () => {
  return (
    <div className="w-full bg-slate-100 py-8 overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-center xl:gap-40 lg:gap-28 md:gap-20 sm:gap-10 gap-8">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="grayscale hover:grayscale-0 transition-all duration-300"
            >
              <img
                src={brand.imageUrl}
                alt={`${brand.name} logo`}
                className="h-12 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
