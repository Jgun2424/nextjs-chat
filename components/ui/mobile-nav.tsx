'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { Home, Search, Bell, User, PlusIcon, MessageCircle, User2, Blocks } from 'lucide-react';
import Link from 'next/link';

export default function MobileNav() {
    const pathname = usePathname();
    const isActiveChat = /^\/chat\/[^/]+$/.test(pathname); // Matches "/chat/id" but not "/chat"
    const isMobile = useIsMobile();
    
    if (pathname.includes('auth') || isActiveChat) {
        return null;
    }

    if (!isMobile) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-sidebar-accent p-4 flex justify-between items-center rounded-t-[30px]">
            <nav className="w-full flex justify-around">
                <Link href="/chat" className="flex flex-col gap-1 justify-center items-center text-white bg-sidebar-border">
                    <MessageCircle className="h-6 w-6" />
                    Chats
                </Link>

                <Link href="/servers" className="flex flex-col gap-1 justify-center items-center text-white bg-sidebar-border">
                    <Blocks className="h-6 w-6" />
                    Servers
                </Link>

                <Link href="/profile" className="flex flex-col gap-1 justify-center items-center text-white bg-sidebar-border">
                    <User2 className="h-6 w-6" />
                    Profile
                </Link>
            </nav>
        </div>
    );
}