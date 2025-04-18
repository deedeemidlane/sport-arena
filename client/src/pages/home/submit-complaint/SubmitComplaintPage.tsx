import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { Footer, Navigation } from "../ui";
import { useState } from "react";
import useSendComplaint from "@/hooks/customer/useSendComplaint";
import { Spinner } from "@/components/common";

type ComplaintFormData = {
  title: string;
  description: string;
};

export default function SubmitComplaintPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ComplaintFormData>();
  const [image, setImage] = useState<File>();

  const { loading, sendComplaint } = useSendComplaint();

  const onSubmit = (data: ComplaintFormData) => {
    console.log("Complaint submitted:", data);

    const formData = new FormData();
    if (image) {
      formData.append("image", image);
    }
    formData.append("data", JSON.stringify(data));

    sendComplaint(formData);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mx-auto max-w-[600px]">
          <a href="/">
            <Button variant="ghost" className="flex items-center gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
          </a>
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Gửi Phản Hồi
              </CardTitle>
              <CardDescription>
                Hãy cho chúng tôi biết vấn đề bạn đang gặp phải
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Tiêu đề</Label>
                  <Input
                    id="title"
                    {...register("title", {
                      required: "Vui lòng nhập tiêu đề",
                    })}
                    placeholder="Nhập tiêu đề phản hồi"
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả chi tiết</Label>
                  <Textarea
                    id="description"
                    {...register("description", {
                      required: "Vui lòng nhập mô tả",
                    })}
                    placeholder="Mô tả chi tiết vấn đề của bạn"
                    rows={5}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Hình ảnh đính kèm (nếu có)</Label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      name="proofImage"
                      id="proofImage"
                      className="mt-1 w-full block text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => {
                        if (e.target.files) {
                          setImage(e.target.files[0]);
                        }
                      }}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Spinner /> : "Gửi phản hồi"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
