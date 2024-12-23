'use client'
import CreateNewChat from '@/components/ui/chat_components/create-new-chat-dialouge'
import React from 'react'
import { useAuth } from '@/context/authContext'
import ChatsSidebar from '@/components/sidebar/chats-sidebar'

export default function Page() {
  const { user } = useAuth()
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  console.log(isMobile);


  return (
      <div className='flex flex-row w-full h-screen'>
        {
          !isMobile && (
            <div className='max-h-full w-full items-center justify-center bg-sidebar/50 flex flex-col'>
            <h1 className='text-4xl font-bold'>Hey! its quiet here!</h1>
            <p className='text-lg'>Select a chat to start messaging</p>
            
            <div>
              <CreateNewChat user={user}/>
            </div>
          </div>
          )
        }

        {
          isMobile && <ChatsSidebar isMobile={true} />
        }
      </div>
    )
  }