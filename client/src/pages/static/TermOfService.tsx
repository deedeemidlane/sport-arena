export const TermOfServicePage = () => {
  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-center text-5xl font-bold text-primary mb-5">
        Điều khoản sử dụng hệ thống Sport Arena
      </h1>
      <div className="flex justify-center mb-5">
        <img src="/logo.png" alt="logo" className="w-10 h-10" />
      </div>
      <div className="text-lg text-justify max-w-[1000px] mx-auto">
        <div className="p-6 bg-white border rounded-xl shadow-md space-y-6 mb-10">
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              I. ĐIỀU KHOẢN CƠ BẢN
            </h2>
            <ul className="list-decimal list-inside space-y-2 text-gray-700">
              <li>
                Bạn hoàn toàn chịu trách nhiệm đối với mọi hoạt động xảy ra
                thông qua tài khoản của bạn.
              </li>
              <li>
                Bạn có trách nhiệm bảo mật thông tin đăng nhập và mật khẩu truy
                cập hệ thống.
              </li>
              <li>
                Bạn không được phép quấy rối, đe dọa, mạo danh hoặc gây phiền
                nhiễu cho người dùng khác.
              </li>
              <li>
                Bạn không được sử dụng hệ thống SportArena vào bất kỳ mục đích
                trái pháp luật nào. Người dùng quốc tế phải tuân thủ tất cả quy
                định pháp luật địa phương.
              </li>
              <li>
                Bạn hoàn toàn chịu trách nhiệm đối với những thông tin, hình
                ảnh, nhận xét, bình luận, liên kết... mà bạn đăng tải trên hệ
                thống.
              </li>
              <li>
                Bạn không được sao chép hoặc chỉnh sửa bất kỳ phần mềm nào để
                giả mạo hoặc gây nhầm lẫn rằng phần mềm đó có liên quan đến
                SportArena.
              </li>
              <li>
                Bạn không được phép đăng tải, chia sẻ, truyền tải hoặc gửi bất
                kỳ nội dung rác (spam), không mong muốn hoặc độc hại nào trên
                nền tảng.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              II. ĐIỀU KIỆN CHUNG
            </h2>
            <ul className="list-decimal list-inside space-y-2 text-gray-700">
              <li>
                Chúng tôi có quyền thay đổi, chỉnh sửa hoặc chấm dứt một phần
                hoặc toàn bộ dịch vụ mà không cần thông báo trước.
              </li>
              <li>
                Việc bạn tiếp tục sử dụng SportArena sau khi có cập nhật đồng
                nghĩa với việc bạn đồng ý với những thay đổi đó.
              </li>
              <li>
                Chúng tôi có quyền từ chối cung cấp dịch vụ cho bất kỳ cá nhân
                nào nếu thấy rằng người đó vi phạm các điều khoản sử dụng hoặc
                pháp luật.
              </li>
              <li>
                Chúng tôi có quyền xóa bỏ nội dung hoặc khóa tài khoản nếu nhận
                thấy nội dung đó vi phạm pháp luật, xúc phạm người khác, hoặc đi
                ngược lại tiêu chuẩn cộng đồng.
              </li>
              <li>
                Bạn đồng ý rằng SportArena có thể sử dụng thông tin tổng hợp từ
                hành vi người dùng cho các mục đích thống kê, cải tiến dịch vụ
                hoặc marketing nội bộ.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              III. CÁC HOẠT ĐỘNG BỊ CẤM
            </h2>
            <p className="mb-2 text-gray-700">
              Bạn không được sử dụng nền tảng SportArena cho bất kỳ hoạt động
              nào ngoài phạm vi mà chúng tôi quy định. Cụ thể:
            </p>
            <ul className="list-decimal list-inside space-y-2 text-gray-700">
              <li>
                Thu thập hoặc biên soạn dữ liệu từ hệ thống mà không có sự cho
                phép của SportArena.
              </li>
              <li>
                Tạo tài khoản giả, thu thập email người dùng để gửi nội dung rác
                (spam).
              </li>
              <li>
                Vượt qua hoặc can thiệp vào hệ thống bảo mật của nền tảng.
              </li>
              <li>Tạo các liên kết không được cấp phép đến hệ thống.</li>
              <li>
                Giả mạo, lừa đảo, khai thác thông tin đăng nhập của người khác.
              </li>
              <li>
                Lạm dụng hệ thống hỗ trợ hoặc báo cáo sai sự cố, hành vi của
                người khác.
              </li>
              <li>
                Sử dụng công cụ tự động (bot, crawler, v.v.) để khai thác dữ
                liệu hệ thống.
              </li>
              <li>
                Gây quá tải hoặc làm gián đoạn hoạt động của hệ thống và mạng
                lưới kết nối.
              </li>
              <li>
                Giả danh người khác hoặc sử dụng tên người dùng không hợp lệ.
              </li>
              <li>Chuyển nhượng tài khoản của bạn cho bên thứ ba.</li>
              <li>
                Sử dụng thông tin thu được từ hệ thống để đe dọa, quấy rối người
                khác.
              </li>
              <li>Giải mã hoặc phá vỡ mã nguồn hệ thống (reverse engineer).</li>
              <li>
                Cố tình vượt qua các biện pháp ngăn chặn truy cập trái phép do
                hệ thống thiết lập.
              </li>
              <li>
                Đe dọa hoặc quấy rối đội ngũ nhân viên hỗ trợ của SportArena.
              </li>
              <li>
                Xóa hoặc chỉnh sửa thông báo bản quyền trong nội dung hệ thống.
              </li>
              <li>
                Sao chép, chỉnh sửa mã nguồn phần mềm như HTML, JavaScript,
                PHP... từ hệ thống.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              IV. CHÍNH SÁCH HOÀN TIỀN
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>
                  Đối với các giao dịch qua ví điện tử hoặc ngân hàng:
                </strong>
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  SportArena sẽ hoàn tiền cho những đơn đặt trước 1 ngày trận
                  đấu gần nhất diễn ra.
                </li>
                <li>
                  Khách hàng có thể yêu cầu hoàn tiền nếu đơn bị hủy bởi chủ sân
                  hoặc hệ thống không cung cấp dịch vụ như cam kết.
                </li>
                <li>
                  Mọi yêu cầu hoàn tiền cần được gửi trong vòng 7 ngày kể từ
                  ngày đặt sân và sẽ được xử lý trong vòng 5 – 7 ngày làm việc.
                </li>
              </ul>

              <p>
                <strong>Trách nhiệm người dùng:</strong> Người dùng có trách
                nhiệm kiểm tra kỹ thông tin trước khi thanh toán và phải tự quản
                lý việc hủy đặt sân theo đúng chính sách được công bố trong phần{" "}
                <span className="italic">[Điều kiện sử dụng dịch vụ]</span>.
              </p>

              <p className="italic text-red-600">
                Lưu ý: Việc sử dụng nền tảng SportArena đồng nghĩa với việc bạn
                đã đọc, hiểu và đồng ý với tất cả các điều khoản trong tài liệu
                này.
              </p>
            </div>
          </section>

          <section className="text-gray-700">
            <h2 className="text-xl font-semibold mt-6">
              Nếu bạn cần hỗ trợ thêm, vui lòng liên hệ:
            </h2>
            <p>
              Email:{" "}
              <a
                href="mailto:support@sportarena.vn"
                className="text-blue-600 underline"
              >
                support@sportarena.vn
              </a>
            </p>
            <p>
              Hotline:{" "}
              <a href="tel:0123456789" className="text-blue-600 underline">
                +84 123 456 789
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
