"use client";

import { useUserStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserRole } from "@/types";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if ((!user && !isLoading) || (user && user.role !== UserRole.ADMIN)) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 flex flex-col min-h-svh">
        <header className="flex h-12 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <div className="h-4 w-px bg-border" />
          <span className="text-sm text-muted-foreground">
            Press{" "}
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              ⌘B
            </kbd>{" "}
            to toggle sidebar
          </span>
        </header>
        <div className="flex-1 p-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}
