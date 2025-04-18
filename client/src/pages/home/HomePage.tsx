import {
  BrandBanner,
  Carousel,
  CourtList,
  Footer,
  Navigation,
  Search,
} from "./ui";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Carousel />
      <BrandBanner />
      <Search showFilter={false} />
      <div>
        <div className="container mx-auto px-4 pt-8">
          <h2 className="text-3xl font-heading font-bold">Danh sách sân</h2>
        </div>
        <CourtList urlSearchParams="" isHomePage={true} />
      </div>
      <Footer />
    </div>
  );
}
