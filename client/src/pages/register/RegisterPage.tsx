import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OwnerForm, PlayerForm } from "./ui";

export default function RegisterPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center">
      <div className="w-fit py-5">
        <Card>
          <CardHeader className="mb-2">
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
              <a href="/login" className="underline underline-offset-4">
                Đăng nhập tại đây
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
