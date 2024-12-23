'use client';

import React, {useEffect, useState} from 'react';
import { useMessages } from '@/context/messageHandler';
import RenderChatMessage from './render-chat-message';
import NewMessage from './new-message';
import { SidebarTrigger } from '../ui/sidebar';
import { useAuth } from '@/context/authContext';

interface chatUsers {
  uid: string;
  displayName: string;
  photoURL: string;
}

export function ChatScreen({ chatId }: { chatId: string }) {
  const { groupedMessages } = useMessages({ chatId });
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
    // get saved users
    const localStorageKey = `chat-${chatId}`;
    
    const savedUsers = localStorage.getItem(localStorageKey);

    console.log('savedUsers', JSON.parse(savedUsers as string));

    setSavedUsers(JSON.parse(savedUsers as string));
    
  }, [chatId]);


  return (
    <div className="flex flex-col justify-between w-full relative max-h-screen" ref={Containter}>
      <div className="bg-sidebar sticky top-0 z-10 p-4 border-b flex flex-row items-center min-h-[81px]">
        <div className="flex items-center gap-2">
            <SidebarTrigger />
            <span className="text-lg font-semibold mt-1">
              {savedUsers.find(e => e.uid != user.uid)?.displayName || 'Unknown User'}
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
      </div>


      <NewMessage chatId={chatId} />
    </div>
  );
}
