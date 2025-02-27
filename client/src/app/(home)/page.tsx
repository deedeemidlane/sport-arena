import Carousel from "./ui/Carousel";
import CourtList from "./ui/CourtList";
import Footer from "./ui/Footer";
import Navigation from "./ui/Navigation";
import Search from "./ui/Search";

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
