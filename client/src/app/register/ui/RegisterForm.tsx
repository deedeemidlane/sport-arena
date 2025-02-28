import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import OwnerForm from "./OwnerForm";
import PlayerForm from "./PlayerForm";

export default function RegisterForm() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="mb-4">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-5 h-5" />
            <span className="text-md font-heading font-bold text-primary">
              SportArena
            </span>
          </a>
          <CardTitle className="text-2xl font-bold text-center">
            Tạo tài khoản
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="player" className="">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="player">Người chơi</TabsTrigger>
              <TabsTrigger value="owner">Chủ sân</TabsTrigger>
            </TabsList>
            <TabsContent value="player">
              <PlayerForm />
            </TabsContent>
            <TabsContent value="owner">
              <OwnerForm />
            </TabsContent>
          </Tabs>

          <div className="mt-4 text-center text-sm">
            Đã có tài khoản?{" "}
            <Link href="/login" className="underline underline-offset-4">
              Đăng nhập tại đây
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
