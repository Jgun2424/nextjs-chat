'use client'
import CreateNewChat from '@/components/ui/create-new-chat-dialouge'
import React from 'react'
import { useAuth } from '@/context/authContext'

export default function page() {
  const { user } = useAuth()


  return (
    <div className='flex flex-col max-h-full w-full items-center justify-center bg-sidebar/50'>
      <h1 className='text-4xl font-bold'>Hey! its quiet here!</h1>
      <p className='text-lg'>Select a chat to start messaging</p>
      
      <div>
        <CreateNewChat user={user}/>
      </div>
    </div>
  )
}
 