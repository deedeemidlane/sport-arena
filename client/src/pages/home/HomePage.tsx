import { Carousel, CourtList, Footer, Navigation, Search } from "./ui";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Carousel />
      <Search />
      <CourtList />
      <Footer />
    </div>
  );
}
