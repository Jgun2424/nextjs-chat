'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { Input } from '../ui/input';
import { SendHorizonalIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/useMobile';
import { useChat } from '@/context/chatContext';
import Image from 'next/image';

export default function NewMessage({ chatId }: { chatId: string }) {
  const { sendMessage } = useChat();
  const isMobile = useIsMobile();
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setImagePreview(null);
    setImage(null);
  }, [chatId]);

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
      setImagePreview(URL.createObjectURL(file));
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImage(null);
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const result = await sendMessage(input, image);

    if (result.success) {
      setInput('');
      setImage(null);
      setImagePreview(null);
      setSending(false);
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="p-4 bg-sidebar border-t sticky bottom-0">
      <div className="flex relative gap-2">
        <div className='flex-1 relative'>
          <div className='flex gap-2'>
            {imagePreview && (
              <div className='relative pb-3'>
                <div className='absolute -top-2 -right-2 border-1 border-white rounded-full bg-red-500 text-white w-4 h-4 flex justify-center items-center cursor-pointer' onClick={handleRemoveImage}>
                x
                </div>
                <Image src={imagePreview} alt='image-preview' width={100} height={100} objectFit='cover' className='rounded-md'/>
            </div>
            )}
          </div>

          <div className='flex gap-2 relative'>
            <Button type="button" variant="ghost" size="icon" onClick={() => fileRef.current?.click()} disabled={imagePreview ? true : false}>📁</Button>
            <input type="file" ref={fileRef} style={{ display: 'none' }} onChange={handleFileChange} accept='image/png,image/jpeg,image/gif,image/svg+xml'/>
            <form className='w-full' onSubmit={handleSendMessage}>
              <Input type="text" placeholder="Type a message..." onChange={handleInputChange} value={input} ref={inputRef} disabled={sending}/>
              {!isMobile ? (
                <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0" onClick={() => setShowPicker(!showPicker)}>😁</Button>
              ) : (
                <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 z-10"><SendHorizonalIcon /></Button>
              )}
            </form>
          </div>
        </div>
      </div>
        <div className="absolute bottom-20 right-5">
          <EmojiPicker theme={Theme.DARK} onEmojiClick={onEmojiClick} open={showPicker}/>
        </div>
    </div>
  )
}