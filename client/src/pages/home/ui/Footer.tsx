import { Facebook, Instagram, Mail, Phone, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-50 py-12 mt-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">SportArena</h3>
            <p className="text-gray-600">
              180 Đình Thôn, Phường Mỹ Đình 1, Quận Nam Từ Liêm, Thành phố Hà
              Nội
            </p>
            <div className="flex gap-1 items-center mt-2 text-gray-600 font-semibold">
              <Phone className="h-5 w-5" />
              <span>0982471940</span>
            </div>
            <div className="flex gap-1 items-center mt-2 text-gray-600 font-semibold">
              <Mail className="h-5 w-5" />
              <span>sportarena@gmail.com</span>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">Liên kết</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/term-of-service"
                  className="text-gray-600 hover:text-primary"
                >
                  Điều khoản
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  className="text-gray-600 hover:text-primary"
                >
                  Chính sách
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">Môn thể thao</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/fields?sportType=FOOTBALL"
                  className="text-gray-600 hover:text-primary"
                >
                  Bóng đá
                </a>
              </li>
              <li>
                <a
                  href="/fields?sportType=BADMINTON"
                  className="text-gray-600 hover:text-primary"
                >
                  Cầu lông
                </a>
              </li>
              <li>
                <a
                  href="/fields?sportType=PICKLEBALL"
                  className="text-gray-600 hover:text-primary"
                >
                  Pickleball
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">Theo dõi</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; 2025 SportArena. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
