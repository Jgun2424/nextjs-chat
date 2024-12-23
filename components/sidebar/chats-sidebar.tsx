import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import moment from 'moment';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader } from '@/components/ui/sidebar';
import { Badge } from '../ui/badge';
import CreateNewChat from '../chat/create-new-chat-dialouge';
import { useChats } from '@/context/useChats';
import { useAuth } from '@/context/authContext';

export default function ChatsSidebar({isMobile}: {isMobile?: boolean}) {
    const pathname = usePathname();
    const { sortedChats } = useChats();
    const {user} = useAuth();


    return (
        <Sidebar collapsible="none" className={`flex-1 md:flex ${isMobile ? 'flex' : 'hidden'}`}>
            <SidebarHeader className="gap-3.5 border-b p-4">
                <div className="flex w-full items-center justify-between">
                    <div className="text-base font-medium text-foreground">
                        Direct Messages
                    </div>
                </div>
                <CreateNewChat user={user}/>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup className="px-0 py-0">
                    <SidebarGroupContent>
                        {sortedChats.map((chat) => (
                            <Link
                                href={`/chat/${chat?.id}`}
                                key={chat.id}
                                className={`flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                                    pathname === `/chat/${chat.id}` ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
                                }`}
                            >
                                <div className="flex w-full max-w-full items-center gap-2 ">
                                    <span className="text-base font-semibold">{chat?.otherUser?.displayName}</span>
                                    <Badge
                                        className="ml-auto"
                                        variant={`${pathname === `/chat/${chat.id}` ? 'default' : 'outline'}`}
                                    >
                                        {moment(chat?.lastMessageTime?.toDate()).fromNow()}
                                    </Badge>
                                </div>
                                <span className="font-medium text-ellipsis overflow-hidden whitespace-nowrap">
                                    {chat?.lastChatSenderID === user?.uid
                                        ? `You: ${chat?.lastChat.slice(0, 15)}...`
                                        : `${chat?.otherUser?.displayName.split(' ')[0]}: ${chat?.lastChat.slice(0, 15)}...`}
                                </span>
                            </Link>
                        ))}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}