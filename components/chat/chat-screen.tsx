'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '@/context/authContext';
import { db } from '@/firebaseConfig';
import { doc, onSnapshot, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { Button } from '../ui/button';
import { SidebarTrigger } from '../ui/sidebar';
import { ChatSkeleton } from './chat-skeleton';
import { AvatarGroup } from '../ui/avatar-group';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import moment from 'moment';
import AddUserToChat from '../ui/add-user-to-chat';
import { Badge } from '../ui/badge';
import LeaveChat from '../ui/leave-chat';


interface Message {
  senderID: string;
  text: string;
  timestamp: string;
}

interface GroupedMessage {
  senderID: string;
  texts: string[];
  timestamp: string;
}

export function ChatScreen({ chatId }: { chatId: string }) {
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { getChatDetails, getUserFromDatabase, user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [groupedMessages, setGroupedMessages] = useState<GroupedMessage[]>([]);
  const [chatDetails, setChatDetails] = useState<any>();
  const [usersInChat, setUsersInChat] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const MESSAGE_GROUP_THRESHOLD = 5 * 60 * 1000;

  const fetchChatDetails = useCallback(async () => {
    if (!chatId || !user) return;

    try {
      const chatDetails = await getChatDetails(chatId);

      if (chatDetails.chatUsers.length <= 1) {
        console.error('No users in chat:', chatDetails);
        return;
      }

      const usersData = await Promise.all(chatDetails.chatUsers.map((uid: string) => getUserFromDatabase(uid)));
      setUsersInChat(usersData);
      setChatDetails(chatDetails);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chat details:', error);
    }
  }, [chatId, getChatDetails, user]);

  useEffect(() => {
    fetchChatDetails();

    const unsubscribe = onSnapshot(doc(db, 'chats', chatId), (doc) => {
      if (doc.exists()) {
        const messages = doc.data().messages as Message[];

        const grouped = messages.reduce<GroupedMessage[]>((acc, message) => {
          const lastGroup = acc[acc.length - 1];
          const currentTime = new Date(message.timestamp).getTime();

          if (
            lastGroup &&
            lastGroup.senderID === message.senderID &&
            currentTime - new Date(lastGroup.timestamp).getTime() <= MESSAGE_GROUP_THRESHOLD
          ) {
            lastGroup.texts.push(message.text);
            lastGroup.timestamp = message.timestamp;
          } else {
            acc.push({
              senderID: message.senderID,
              texts: [message.text],
              timestamp: message.timestamp,
            });
          }
          return acc;
        }, []);

        setGroupedMessages(grouped);
      }
    });

    return () => unsubscribe();
  }, [chatId, MESSAGE_GROUP_THRESHOLD]);

  useEffect(() => {
    if (!chatId || !user) return;
  
    const unsubscribe = onSnapshot(doc(db, 'chats', chatId), async (doc) => {
      if (doc.exists()) {
        const chatDetails = doc.data();
        
        const updatedUserIds = chatDetails.chatUsers || [];
  
        // Check if the new user list is different from the current state
        const currentUserIds = usersInChat.map((user) => user.uid);
        const hasChanges = 
          updatedUserIds.length !== currentUserIds.length ||
          updatedUserIds.some((id, idx) => id !== currentUserIds[idx]);
  
        if (!hasChanges) return; // Skip updating if there are no changes
  
        try {
          const usersData = await Promise.all(
            updatedUserIds.map((uid: string) => getUserFromDatabase(uid))
          );
          setUsersInChat(usersData);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching updated chat users:', error);
        }
      }
    });
  
    return () => unsubscribe();
  }, [chatId, user, usersInChat]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [groupedMessages]);

  useEffect(() => {
    if (inputRef.current && chatRef.current) {
      inputRef.current.focus();
      chatRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [loading, chatId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) return;

      const newMessage: Message = {
        senderID: user.uid,
        text: message.trim(),
        timestamp: new Date().toISOString(),
      };

      try {
        await updateDoc(doc(db, 'chats', chatId), {
          messages: arrayUnion(newMessage),
          lastChat: newMessage.text,
          lastChatSenderID: newMessage.senderID,
          lastMessageTime: serverTimestamp(),
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    },
    [chatId, user]
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
    setInput('');
  };

  const onEmojiClick = (emojiObject: any) => {
    setInput((prev) => prev + emojiObject.emoji);
    setShowPicker(false);
    inputRef.current?.focus();
  };

  if (loading) return <ChatSkeleton />;

  console.log(chatDetails);

  return (
    <div className="flex flex-col justify-between max-h-full w-full max-w-full" ref={chatRef}>
      <div className="bg-sidebar sticky top-0 z-10 p-4 border-b flex flex-row items-center justify-between min-h-[81px]">

        <div className='flex items-center gap-2'>
        <SidebarTrigger className="-ml-1" />
          {chatDetails?.isGroupChat ? (
            <span className="text-base mt-1 font-medium text-foreground">
              {chatDetails.groupName}
            </span>
          ) : (
            <span className="text-base mt-1 font-medium text-foreground">
              {usersInChat.find((chatUser) => chatUser?.uid !== user?.uid)?.displayName}
            </span>
          )}
        </div>

        <div className="flex gap-2 h-full">
          <AvatarGroup max={2} size="sm" className="bg-secondary p-2 rounded-lg">
            {usersInChat.map((user) => (
              <Avatar key={user.uid}>
                <AvatarImage src={user.photoURL} />
                <AvatarFallback>{user.displayName?.[0] || 'U'}</AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
          <AddUserToChat chatId={chatId}/>
          <LeaveChat chatId={chatId} userId={user?.uid}/>
        </div>
      </div>

      <div className="flex-1 flex flex-col-reverse bg-sidebar max-w-full overflow-hidden">
        {groupedMessages.slice().reverse().map((group, index) => {
          if (group.senderID === 'system') {
            return (
              <div key={index} className="flex px-4 py-2">
              <Avatar>
                <AvatarImage src='/gerald.png' />
                <AvatarFallback>G</AvatarFallback>
              </Avatar>
              <div className="flex flex-col ml-3">
                <div className='flex gap-2 items-center'>
                  <span className="text-md font-semibold hover:underline cursor-pointer flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger>Gerald</PopoverTrigger>
                      <PopoverContent side='right' sideOffset={5}>Place content for the popover here.</PopoverContent>
                    </Popover>
                    
                    <Badge variant='default' className='ml-auto'>System</Badge>

                  </span>

                </div>
                {group.texts.map((text, idx) => (
                  <p key={idx} className={/^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])+$/.test(text) ? 'text-[40px] pt-2' : 'break-all'}>
                    {text}
                  </p>
                ))}
              </div>
            </div>
            );
          }
          const sender = usersInChat.find((user) => user?.uid === group.senderID);

          return (
            <div key={index} className="flex bg-sidebar px-4 py-2">
              <Avatar>
                <AvatarImage src={sender?.photoURL} />
                <AvatarFallback>{sender?.displayName?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col ml-3">
                <div className='flex gap-2 items-center'>
                  <span className="text-md font-semibold hover:underline cursor-pointer">
                    <Popover>
                      <PopoverTrigger>{sender?.displayName || 'Unknown User'}</PopoverTrigger>
                      <PopoverContent side='right' sideOffset={5}>Place content for the popover here.</PopoverContent>
                    </Popover>

                  </span>

                  <span className='text-sm text-muted-foreground'>{moment(group?.timestamp).calendar()}</span>
                </div>
                {group.texts.map((text, idx) => (
                  <p key={idx} className={/^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])+$/.test(text) ? 'text-[40px] pt-2' : 'break-all'}>
                    {text}
                  </p>
                ))}
              </div>
            </div>
          );
        })}

          <div className="p-4 flex flex-col text-muted-foreground border-t gap-2">
            <h3 className="text-4xl font-bold text-white">Welcome</h3>
            <p>
              This is the start of your chat history with{' '}
              {usersInChat.length === 2
                ? usersInChat.find((chatUser) => chatUser?.uid !== user?.uid)?.displayName
                : `${usersInChat.length} group members`}
            </p>

            {groupedMessages.length < 1 ? (
              <div>
                <Button variant="secondary" onClick={() => sendMessage('Hello! 👋')}>
                  Say Hello! 👋
                </Button>
              </div>
              ): null}
          </div>
      </div>

      <div className="p-4 bg-sidebar border-t sticky bottom-0">
        <form onSubmit={handleSendMessage}>
          <div className="flex relative">
            <Input
              type="text"
              placeholder="Type a message..."
              onChange={handleInputChange}
              value={input}
              ref={inputRef}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0"
              onClick={() => setShowPicker(!showPicker)}
            >
              😁
            </Button>
          </div>
          {showPicker && (
            <div className="absolute bottom-20 right-3">
              <EmojiPicker theme={Theme.DARK} onEmojiClick={onEmojiClick} />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
