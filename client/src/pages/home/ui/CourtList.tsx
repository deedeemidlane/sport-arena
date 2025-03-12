import { Star, MapPin, Clock } from "lucide-react";

const courts = [
  {
    id: 1,
    name: "Downtown Sports Arena",
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=400&h=300&q=80",
    openTime: "07:00 - 22:00",
    location: "Downtown District",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Green Valley Courts",
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=400&h=300&q=80",
    openTime: "08:00 - 21:00",
    location: "Green Valley",
    rating: 4.5,
  },
  {
    id: 3,
    name: "City Sports Complex",
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=400&h=300&q=80",
    openTime: "06:00 - 23:00",
    location: "City Center",
    rating: 4.9,
  },
  {
    id: 4,
    name: "Riverside Courts",
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=400&h=300&q=80",
    openTime: "07:00 - 21:00",
    location: "Riverside District",
    rating: 4.7,
  },
];

export function CourtList() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h2 className="text-3xl font-heading font-bold mb-8">
        Danh sách sân tập
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courts.map((court) => (
          <div
            key={court.id}
            className="cursor-pointer rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] shadow"
          >
            <div className="relative h-48">
              <img
                src={court.image}
                alt={court.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-heading font-semibold text-lg mb-2">
                {court.name}
              </h3>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Clock className="h-4 w-4 mr-1" />
                {court.openTime}
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                {court.location}
              </div>
              <div className="flex items-center text-sm">
                <Star className="h-4 w-4 mr-1 text-yellow-400" />
                {court.rating}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
