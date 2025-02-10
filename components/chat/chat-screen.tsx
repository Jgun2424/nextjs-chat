'use client';

import React, {useEffect} from 'react';
import RenderChatMessage from './render-chat-message';
import NewMessage from './new-message';
import { SidebarTrigger } from '../ui/sidebar';
import { useChat } from '@/context/chatContext';
import { useIsMobile } from '@/hooks/useMobile';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/authContext';
import { Button } from '../ui/button';

export function ChatScreen({ chatId }: { chatId: string }) {
  const isMobile = useIsMobile()
  const { user } = useAuth()
  const { setChatId, messages, chatUsers, sendMessage } = useChat()
  const Containter = React.createRef<HTMLDivElement>();
  const messageContainer = React.createRef<HTMLDivElement>();

  useEffect(() => {
    setChatId(chatId)
  }, [chatId, setChatId])


  return (
    <div className="flex flex-col justify-between w-full relative max-h-screen" ref={Containter}>
      <div className="bg-sidebar sticky top-0 z-10 p-4 border-b flex flex-row items-center min-h-[81px]">
        <div className="flex items-center gap-2">
            {!isMobile && <SidebarTrigger />}
            
            {isMobile && (
              <Link href="/chat">
              <div className='bg-sidebar-accent flex items-center justify-center rounded-lg p-1'>
                <ChevronLeft size={16}/>
              </div>
            </Link>
            )}
              
            <span className="text-lg font-semibold mt-1">
              {chatUsers?.length === 2 ? chatUsers?.find((chatUser) => chatUser?.uid !== user?.uid)?.displayName : `${chatUsers?.length} group members`}
            </span>
          </div>
      </div>

      <div className="flex flex-col-reverse bg-sidebar max-w-full max-h-full h-full overflow-y-scroll" style={{ WebkitOverflowScrolling: 'touch', height: '100%' }} ref={messageContainer}>
        {messages.slice().reverse().map((group, index) => (
          <RenderChatMessage {...group} key={index}/>
        ))}

          <div className="p-4 flex flex-col text-muted-foreground border-t gap-2">
            <h3 className="text-4xl font-bold">Welcome</h3>
            <p>
              This is the start of your chat history with{' '}
              {chatUsers?.length === 2 ? chatUsers?.find((chatUser) => chatUser?.uid !== user?.uid)?.displayName : `${chatUsers?.length} group members`}
            </p>
            <div><Button variant="secondary" onClick={
              async () => {
                await sendMessage('Hello!', null)
              }
            }>👋 Say Hello!</Button></div>
          </div>
      </div>


      <NewMessage chatId={chatId} />
    </div>
  );
}
