"use client";
import Image from "next/image";
import SkyImage from "@/assets/space.jpg";
import { Button } from "@/components/ui/button";
import { AppleIcon, GoogleIcon } from "@hugeicons/core-free-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { endpoints } from "@/config/endpoints";
import { AuthServices } from "@/services";
import { useUserStore } from "@/store";

export function Login() {
  const router = useRouter();
  const { user, isLoading } = useUserStore();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  const googleLoginMutation = useMutation({
    mutationKey: [endpoints.auth.google.query],
    mutationFn: AuthServices.getGoogleAuthUrl,
    onSuccess: (data) => {
      if (data?.data?.payload.link) {
        window.location.assign(data?.data?.payload?.link);
      }
    },
  });

  const appleLoginMutation = useMutation({
    mutationKey: [endpoints.auth.apple.query],
    mutationFn: AuthServices.getAppleAuthUrl,
    onSuccess: (data) => {
      if (data?.data?.payload.link) {
        window.location.assign(data?.data?.payload?.link);
      }
    },
  });

  return (
    <main className={"flex items-center justify-between min-h-dvh w-full"}>
      <div className={"w-1/2 flex gap-2 flex-col items-center justify-center"}>
        <h1>Welcome to Ravix Studio</h1>
        <Button
          loading={googleLoginMutation.isPending}
          icon={GoogleIcon}
          size={"lg"}
          onClick={() => googleLoginMutation.mutate()}
        >
          Login With Google
        </Button>
        <Button
          loading={appleLoginMutation.isPending}
          icon={AppleIcon}
          size={"lg"}
          variant={"outline"}
          onClick={() => appleLoginMutation.mutate()}
        >
          Login With Apple
        </Button>
      </div>
      <div className={"w-1/2 h-screen relative"}>
        <Image src={SkyImage} alt={"Sky's image"} fill={true} />
      </div>
    </main>
  );
}
