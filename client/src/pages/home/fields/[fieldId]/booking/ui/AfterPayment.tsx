import { Button } from "@/components/ui/button";
import { CircleCheckBig } from "lucide-react";

export const AfterPayment = () => {
  return (
    <div className="mt-20 mb-20">
      <div className="m-auto sm:w-96 rounded-lg border border-gray-200 bg-white/90 p-5 shadow-lg">
        <div className="w-full flex justify-center">
          <CircleCheckBig color="#73bf40" className="w-20 h-20" />
        </div>
        <h1 className="text-center text-3xl font-bold dark:text-white my-3 mb-6">
          Đặt sân thành công
        </h1>

        <p className="text-center">
          Vui lòng chờ chủ sân xác nhận yêu cầu đặt sân của bạn.
        </p>

        <div className="flex flex-col gap-3 mt-3">
          <a href="/">
            <Button className="w-full">Về trang chủ</Button>
          </a>
        </div>
      </div>
    </div>
  );
};
