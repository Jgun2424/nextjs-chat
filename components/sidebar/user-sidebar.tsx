"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Moon,
  Sparkles,
  User,
  UserIcon,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useTheme } from "next-themes"
import { useAuth } from "@/context/authContext"
import Link from "next/link"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { signOut, user } = useAuth()
  const { setTheme } = useTheme()
  
  if (!user) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.photoURL} alt={user.displayName} />
                <AvatarFallback className="rounded-lg">U</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.displayName}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.photoURL} alt={user.displayName} />
                <AvatarFallback className="rounded-lg">U</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.displayName}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <Link href="/profile">
              <DropdownMenuItem>
                <UserIcon />
                Profile
              </DropdownMenuItem>
            </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <DropdownMenuItem>
                    <UserIcon />
                    App Theme
                  </DropdownMenuItem>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="right"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      <Moon />
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      <Sparkles />
                      Light
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
