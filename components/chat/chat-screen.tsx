'use client';

import React from 'react';
import { useMessages } from '@/context/messageHandler';
import RenderChatMessage from '../ui/render-chat-message';
import NewMessage from '../ui/new-message';
import { SidebarTrigger } from '../ui/sidebar';

export function ChatScreen({ chatId }: { chatId: string }) {
  const { groupedMessages } = useMessages({ chatId });
  const messageContainer = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (messageContainer.current) {
      messageContainer.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [groupedMessages, chatId]);


  return (
    <div className="flex flex-col justify-between max-h-full w-full max-w-full" ref={messageContainer}>
      <div className="bg-sidebar sticky top-0 z-10 p-4 border-b flex flex-row items-center justify-between min-h-[81px]">
        <SidebarTrigger />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="/images/avatar.png" className="w-10 h-10 rounded-full" />
            <div className="flex flex-col">
              <span className="text-lg font-semibold">User Name</span>
              <span className="text-sm text-sidebar-accent">Online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col-reverse bg-sidebar max-w-full overflow-hidden">
        {groupedMessages.slice().reverse().map((group) => (
          <RenderChatMessage
              key={group.senderID == "system" ? `sys-${Math.random().toString()}` : group.timestamp}
              message={group.messages as [{ text: string; imageUrl?: string | null }]}
              senderDisplayName={group.senderDisplayName}
              timestamp={group.timestamp}
              senderID={group.senderID}
              senderPhotoURL={group.senderPhotoURL}
          />
        ))}
      </div>
      <NewMessage chatId={chatId} />
    </div>
  );
}
