"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  IconCamera,
  IconChartBar,
  IconFolder,
  IconReport,
  IconUsers,
  IconCirclePlusFilled,
  IconSettings,
  IconHelp,
  IconSearch,
} from "@tabler/icons-react";

import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    { title: "User", url: "/dashboard-full/user", icon: IconUsers },
    { title: "Customer", url: "/dashboard-full/customer", icon: IconCamera },
    { title: "Barang", url: "/dashboard-full/barang", icon: IconFolder },
    { title: "Persediaan", url: "/dashboard-full/stock", icon: IconReport },
    { title: "Pemesanan", url: "/dashboard-full/order", icon: IconChartBar },
  ],
  navSecondary: [
    { title: "Settings", url: "#", icon: IconSettings },
    { title: "Get Help", url: "#", icon: IconHelp },
    { title: "Search", url: "#", icon: IconSearch },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <span className="text-base font-semibold">PT Biawak Tbk</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              <SidebarMenuItem className="flex items-center gap-2">
                <SidebarMenuButton
                  tooltip="Quick Create"
                  asChild
                  className={`min-w-8 transition-colors duration-200 ease-linear ${
                    pathname === "/dashboard-full"
                      ? "bg-primary text-primary-foreground hover:bg-gray-100 active:bg-gray-200"
                      : "hover:bg-gray-100 active:bg-gray-200"
                  }`}
                >
                  <Link href="/dashboard-full">
                    <IconCirclePlusFilled />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            <SidebarMenu>
              {data.navMain.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      asChild
                      className={`transition-colors duration-200 ease-linear ${
                        isActive
                          ? "bg-primary text-primary-foreground hover:bg-gray-100 active:bg-gray-200"
                          : "hover:bg-gray-100 active:bg-gray-200"
                      }`}
                    >
                      <Link href={item.url}>
                        {item.icon && <item.icon className="size-5" />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
