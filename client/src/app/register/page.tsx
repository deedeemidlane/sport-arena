import RegisterForm from "./ui/RegisterForm";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center sm:p-6 md:p-10">
      <div className="w-full max-w-[500px]">
        <RegisterForm />
      </div>
    </div>
  );
}
