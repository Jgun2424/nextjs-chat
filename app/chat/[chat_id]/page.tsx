'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import { ChatScreen } from '@/components/chat/chat-screen'
import { ChatProvider } from '@/context/chatContext'

export default function Page() {
  const { chat_id } = useParams() as { chat_id: string | string[] }

  return (
    <>
      <ChatProvider>
        <ChatScreen chatId={Array.isArray(chat_id) ? chat_id[0] : chat_id} />
      </ChatProvider>
    </>
  )
}
