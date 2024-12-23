'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { Input } from './input';
import { uploadImage } from '@/utils/uploadImage';
import { useAuth } from '@/context/authContext';
import { db } from '@/firebaseConfig';
import { updateDoc, doc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { SendHorizonalIcon } from 'lucide-react';

interface Message {
    senderID: string;
    text: string;
    timestamp: string;
    imageUrl?: string | null;
}

export default function NewMessage({ chatId }: { chatId: string }) {
  const [input, setInput] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [imageQueue, setImageQueue] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setImageQueue([]);
  }, [chatId]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const onEmojiClick = (emojiObject: any) => {
    setInput((prev) => prev + emojiObject.emoji);
    setShowPicker(false);
    inputRef.current?.focus();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setImageQueue((prev) => [...prev, URL.createObjectURL(file)]);
    }
  }

  const convertBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }

  const handleRemoveImage = (index: number) => {
    setImageQueue((prev) => prev.filter((_, i) => i !== index));
  }

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    let imageUrl = null;
    if (image) {
      const base64 = await convertBase64(image);
      imageUrl = await uploadImage(base64);
    }

    const newMessage: Message = {
      senderID: user.uid,
      text: message.trim(),
      timestamp: new Date().toISOString(),
      imageUrl: imageUrl,
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
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(input);
    setInput('');
    setImage(null);
    setImageQueue([]);
    setImageUrl(null);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="p-4 bg-sidebar border-t relative bottom-0">
      <div className="flex relative gap-2">
        <div className='flex-1 relative'>
          <div className='flex gap-2'>
            {imageQueue.map((image, index) => (
              <div className='relative pb-3' key={index}>
                <div className='absolute -top-2 -right-2 border-1 border-white rounded-full bg-red-500 text-white w-4 h-4 flex justify-center items-center cursor-pointer' onClick={() => handleRemoveImage(index)}>
                  x
                </div>
                <img key={index} src={image} className='w-10 h-10 rounded-md' />
              </div>
            ))}
          </div>

          <div className='flex gap-2 relative'>
            <Button type="button" variant="ghost" size="icon" onClick={() => fileRef.current?.click()} disabled={imageQueue.length >= 1}>📁</Button>
            <input type="file" ref={fileRef} style={{ display: 'none' }} onChange={handleFileChange} />
            <form className='w-full' onSubmit={handleSendMessage}>
              <Input type="text" placeholder="Type a message..." onChange={handleInputChange} value={input} ref={inputRef} />
              {!isMobile ? (
                <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0" onClick={() => setShowPicker(!showPicker)}>😁</Button>
              ) : (
                <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 z-10"><SendHorizonalIcon /></Button>
              )}
            </form>
          </div>
        </div>
      </div>
      {showPicker && (
        <div className="absolute bottom-20 right-3">
          <EmojiPicker theme={Theme.DARK} onEmojiClick={onEmojiClick} />
        </div>
      )}
    </div>
  )
}