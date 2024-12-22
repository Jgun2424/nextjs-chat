'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import { ChatScreen } from '@/components/chat/chat-screen'

export default function page() {
  const { chat_id } = useParams()

  return (
    <>
        <ChatScreen chatId={chat_id} />
    </>
  )
}
