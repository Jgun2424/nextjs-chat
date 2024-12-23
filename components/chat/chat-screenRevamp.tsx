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
      <div className="flex-1 flex flex-col-reverse bg-sidebar max-w-full overflow-hidden">
        {groupedMessages.slice().reverse().map((group, index) => (
          <RenderChatMessage
              key={group.senderID == "system" ? `sys-${Math.random().toString()}` : group.timestamp}
              message={group.messages}
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
