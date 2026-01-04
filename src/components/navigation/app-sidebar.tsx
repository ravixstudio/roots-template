"use client";

import {
  HomeIcon,
  LogOut,
  People,
  Settings01Icon,
  UserIcon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
  useSidebar,
} from "../ui/sidebar";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { endpoints } from "@/config";
import { AuthServices } from "@/services";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/utils";

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    title: "Users",
    href: "/users",
    icon: People,
  },
];

const settingsNavItems = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings01Icon,
  },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useUserStore();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const logoutMutation = useMutation({
    mutationKey: [endpoints.auth.logout.query],
    mutationFn: AuthServices.logout,
    onSuccess: () => {
      setUser(null);
      router.push("/login");
    },
  });

  const userInitials = getInitials(user?.firstName, user?.lastName);

  return (
    <Sidebar collapsible="icon">
      {/* Brand Header */}
      <SidebarHeader className="border-b border-sidebar-border">
        <div className={`flex items-center py-1 ${isCollapsed ? "justify-center" : "gap-3 px-2"}`}>
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
            R
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-tight">Ravix Studio</span>
              <span className="text-[10px] text-muted-foreground">Admin Panel</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.title}>
                  <Link href={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      className={
                        isActive
                          ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                          : ""
                      }
                    >
                      <HugeiconsIcon icon={item.icon} className={isActive ? "text-primary" : ""} />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Settings Section */}
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarMenu>
            {settingsNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.title}>
                  <Link href={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      className={
                        isActive
                          ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                          : ""
                      }
                    >
                      <HugeiconsIcon icon={item.icon} className={isActive ? "text-primary" : ""} />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* User Footer */}
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="w-full outline-none"
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    tooltip={user?.firstName || "User"}
                  />
                }
              >
                <Avatar className="size-8 shrink-0">
                  <AvatarImage src={user?.avatar} alt={user?.firstName} />
                  <AvatarFallback className="bg-linear-to-br from-primary/80 to-primary text-primary-foreground">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <>
                    <div className="flex min-w-0 flex-1 flex-col items-start text-left">
                      <span className="w-full truncate font-medium text-sm">
                        {user?.firstName} {user?.lastName}
                      </span>
                      <span className="w-full truncate text-[10px] text-muted-foreground">
                        {user?.email}
                      </span>
                    </div>
                    <HugeiconsIcon icon={ArrowDown01Icon} className="size-4 shrink-0 opacity-50" />
                  </>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56"
                align="end"
                side={isCollapsed ? "right" : "top"}
                sideOffset={8}
              >
                <div className="flex items-center gap-2 px-2 py-2">
                  <Avatar className="size-8 shrink-0">
                    <AvatarImage src={user?.avatar} alt={user?.firstName} />
                    <AvatarFallback className="bg-linear-to-br from-primary/80 to-primary text-primary-foreground">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <HugeiconsIcon icon={UserIcon} className="mr-2 size-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HugeiconsIcon icon={Settings01Icon} className="mr-2 size-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  className="text-destructive focus:text-destructive"
                >
                  <HugeiconsIcon icon={LogOut} className="mr-2 size-4" />
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
