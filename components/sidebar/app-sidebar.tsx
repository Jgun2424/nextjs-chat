"use client"

import * as React from "react"
import { Command, Inbox, Layers } from "lucide-react"

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import ChatsSidebar from "./chats-sidebar"
import { usePathname, useRouter } from "next/navigation"
import { useSidebar } from "@/components/ui/sidebar"



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const [activeNav, setActiveNav] = React.useState('')


  const data = {
    navMain: [
      {
        title: "Direct Messages",
        url: "/chat",
        icon: Inbox,
      },
      {
        title: "Servers",
        url: "/servers",
        icon: Layers,
      }
    ]
  }

  const pathname = usePathname()
  const router = useRouter()
  const { toggleSidebar, isMobile } = useSidebar()

  if (pathname.includes('auth')) {
    return null
  }

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
      {...props}
    >
      <Sidebar
        collapsible="none"
        className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Command className="size-4" />
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton

                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      isActive={pathname.includes(item.url)}
                      onClick={() => {
                        toggleSidebar()
                        setActiveNav(item.url)
                        isMobile && router.push(item.url)
                        
                      }}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>

      { (activeNav.includes('chat') || pathname.includes('chat')) && <ChatsSidebar isMobile={false}/> }
    </Sidebar>
  )
}
