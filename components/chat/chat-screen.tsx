'use client';

import React, {useEffect, useState} from 'react';
import { useMessages } from '@/context/messageHandler';
import RenderChatMessage from './render-chat-message';
import NewMessage from './new-message';
import { SidebarTrigger } from '../ui/sidebar';
import { useAuth } from '@/context/authContext';
import { Button } from '../ui/button';

interface chatUsers {
  uid: string;
  displayName: string;
  photoURL: string;
}

export function ChatScreen({ chatId }: { chatId: string }) {
  const { groupedMessages, users } = useMessages({ chatId });
  const messageContainer = React.useRef<HTMLDivElement>(null);
  const Containter = React.useRef<HTMLDivElement>(null);
  const [savedUsers, setSavedUsers] = useState<chatUsers[]>([]);
  const { user } = useAuth();


  useEffect(() => {
    if (messageContainer.current) {
      messageContainer.current.scrollTop = messageContainer.current.scrollHeight;
    }
  }, [groupedMessages, chatId]);

  useEffect(() => {
    const savedUsers = users;
    setSavedUsers(JSON.parse(JSON.stringify(savedUsers)));
  }, [chatId, users]);

  if (!user && savedUsers.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col justify-between w-full relative max-h-screen" ref={Containter}>
      <div className="bg-sidebar sticky top-0 z-10 p-4 border-b flex flex-row items-center min-h-[81px]">
        <div className="flex items-center gap-2">
            <SidebarTrigger />
            <span className="text-lg font-semibold mt-1">
              {savedUsers?.find(e => e.uid != user.uid)?.displayName || 'Unknown User'}
            </span>
          </div>
      </div>

      <div className="flex flex-col-reverse bg-sidebar max-w-full max-h-full h-full overflow-y-scroll" style={{ WebkitOverflowScrolling: 'touch', height: '100%' }} ref={messageContainer}>
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

          <div className="p-4 flex flex-col text-muted-foreground border-t gap-2">
            <h3 className="text-4xl font-bold text-white">Welcome</h3>
            <p>
              This is the start of your chat history with{' '}
              {savedUsers?.length === 2
                ? savedUsers?.find((chatUser) => chatUser?.uid !== user?.uid)?.displayName
                : `${savedUsers?.length} group members`}
            </p>
          </div>
      </div>


      <NewMessage chatId={chatId} />
    </div>
  );
}
