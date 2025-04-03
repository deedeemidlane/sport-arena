import { Carousel, CourtList, Footer, Navigation, Search } from "./ui";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Carousel />
      <Search />
      <div>
        <div className="container mx-auto px-4 pt-12">
          <h2 className="text-3xl font-heading font-bold">Danh sách sân tập</h2>
        </div>
        <CourtList />
      </div>
      <Footer />
    </div>
  );
}
