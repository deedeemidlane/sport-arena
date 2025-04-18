export const PrivacyPolicyPage = () => {
  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-center text-5xl font-bold text-primary mb-5">
        Chính sách bảo mật hệ thống Sport Arena
      </h1>
      <div className="flex justify-center mb-5">
        <img src="/logo.png" alt="logo" className="w-10 h-10" />
      </div>
      <div className="text-lg text-justify max-w-[1000px] mx-auto">
        <div className="p-6 bg-white border rounded-xl shadow-md space-y-6 mb-10">
          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                1. Mục đích và phạm vi thu thập thông tin
              </h3>
              <p>
                SportArena cam kết thu thập thông tin cá nhân của người dùng một
                cách minh bạch và chỉ sử dụng cho các mục đích sau:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>
                  Quản lý tài khoản người dùng và hỗ trợ quá trình đặt sân.
                </li>
                <li>Xử lý thanh toán và gửi xác nhận giao dịch.</li>
                <li>
                  Cung cấp thông tin về các chương trình khuyến mãi, sự kiện thể
                  thao.
                </li>
                <li>
                  Cải thiện chất lượng dịch vụ thông qua phản hồi và khảo sát.
                </li>
              </ul>

              <p className="mt-4">Thông tin thu thập bao gồm:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Họ và tên.</li>
                <li>Số điện thoại.</li>
                <li>Địa chỉ email.</li>
                <li>Thông tin đăng nhập (tên người dùng, mật khẩu).</li>
                <li>Lịch sử đặt sân và giao dịch thanh toán.</li>
                <li>
                  Thông tin thiết bị và địa chỉ IP (để hỗ trợ bảo mật và cải
                  thiện dịch vụ).
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                2. Phạm vi sử dụng thông tin
              </h3>
              <p>
                Thông tin cá nhân của người dùng được sử dụng trong nội bộ hệ
                thống SportArena và có thể được chia sẻ với các bên thứ ba trong
                các trường hợp sau:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Đối tác cung cấp dịch vụ thanh toán để xử lý giao dịch.</li>
                <li>Cơ quan pháp luật khi có yêu cầu hợp pháp.</li>
                <li>
                  Các bên liên quan trong trường hợp cần thiết để bảo vệ quyền
                  lợi của SportArena và người dùng.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                3. Thời gian lưu trữ thông tin
              </h3>
              <p>
                Thông tin cá nhân của người dùng được lưu trữ trong hệ thống của
                SportArena cho đến khi người dùng yêu cầu xóa bỏ hoặc khi không
                còn cần thiết cho mục đích cung cấp dịch vụ.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                4. Bảo mật thông tin cá nhân
              </h3>
              <p>
                SportArena áp dụng các biện pháp bảo mật phù hợp để bảo vệ thông
                tin cá nhân của người dùng, bao gồm:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Sử dụng giao thức HTTPS để mã hóa dữ liệu truyền tải.</li>
                <li>Lưu trữ mật khẩu dưới dạng mã hóa.</li>
                <li>
                  Giới hạn quyền truy cập vào thông tin cá nhân chỉ cho những
                  nhân viên cần thiết.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                5. Quyền của người dùng
              </h3>
              <p>Người dùng có quyền:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Truy cập và cập nhật thông tin cá nhân của mình.</li>
                <li>Yêu cầu xóa thông tin cá nhân khỏi hệ thống.</li>
                <li>
                  Phản đối việc sử dụng thông tin cá nhân cho mục đích tiếp thị.
                </li>
              </ul>
              <p className="mt-2">
                Để thực hiện các quyền này, người dùng có thể liên hệ với
                SportArena qua email hoặc số điện thoại hỗ trợ.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">6. Liên hệ</h3>
              <p>
                Nếu có bất kỳ câu hỏi hoặc yêu cầu nào liên quan đến chính sách
                bảo mật, vui lòng liên hệ:
              </p>
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
                <a href="tel:+84123456789" className="text-blue-600 underline">
                  +84 123 456 789
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
