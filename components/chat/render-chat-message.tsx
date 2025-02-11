import React, { useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import moment from 'moment';
import UserCard from './user-card';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { CopyIcon, ReplyIcon } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
  import { useChat } from '@/context/chatContext';
  

  interface Message {
    messageID: string;
    senderID: string;
    senderDisplayName?: string;
    senderPhotoURL?: string;
    isReply?: boolean;
    replyToId?: string | null;
    imageUrl?: string | null;
    text: string;
    timestamp: string;
}

interface GroupedMessages {
    senderID: string;
    senderDisplayName: string;
    senderPhotoURL: string;
    timestamp: Date;
    messages: Message[];
}


const RenderChatMessage: React.FC<GroupedMessages> = (props) => {
    const [hoveredId, setHoveredId] = React.useState<string | null>(null);
    const { setReplyToId, replyToId, rawMessages } = useChat();

    
    const { messages, senderID, senderDisplayName, senderPhotoURL, timestamp } = props;



    return (
        <div className="flex bg-sidebar px-4 py-2 w-full">
            <Avatar className='object-cover'>
                <AvatarImage src={senderPhotoURL || undefined} className='object-cover'/>
                <AvatarFallback>{'U'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col ml-3 w-full relative">
                <div className="flex gap-2 items-center">
                    <span className="text-md font-semibold hover:underline cursor-pointer">
                        <UserCard senderDisplayName={senderDisplayName} senderID={senderID} />
                    </span>
                    <span className="text-sm text-muted-foreground">
                        {timestamp ? moment(timestamp).calendar() : ''}
                    </span>
                </div>
                {messages.map((m, idx) => (
                    <div className='flex flex-col w-full' key={idx}>
                        {m.isReply && (
                            <div className='bg-secondary p-3 rounded-md mb-2 border-primary border-l-4'>
                                <div className='flex gap-2'>
                                    <ReplyIcon size={16}/>
                                    <span className='text-sm font-semibold'>
                                        {rawMessages.find((message) => message.messageID === m.replyToId)?.senderDisplayName}
                                    </span>
                                </div>
                                <p className='text-sm'>
                                    {rawMessages.find((message) => message.messageID === m.replyToId)?.text}
                                </p>
                            </div>
                        )}
                    <div className='hover:bg-secondary/40 w-full rounded-md relative py-1' onMouseMove={() => setHoveredId(m.messageID)} onMouseLeave={() => setHoveredId(null)}>
                        {
                            m.imageUrl ? (
                                <Dialog>
                                    <DialogTrigger>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={m.imageUrl} alt="chat-image" className="w-40 h-40 object-cover rounded-md mt-2 mb-1 sm:w-80 sm:h-80"/>
                                    </DialogTrigger>

                                    <DialogContent className='max-w-[55vh] overflow-hidden'>
                                     {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={m.imageUrl} alt="chat-image" className="w-full h-full object-cover rounded-md"/>
                                    </DialogContent>
                                </Dialog>
                            ) : null
                        }
                        <p className={/^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])+$/.test(m.text) ? 'text-[40px] pt-2': 'break-all w-full'}>
                            {m.text}
                        </p>

                        <div className={`absolute right-0 -top-5 bg-sidebar-accent rounded-full p-2 flex gap-3 ${hoveredId === m.messageID ? 'flex' : 'hidden'}`}>
                                <TooltipProvider>
                                    <Tooltip delayDuration={10}>
                                    <TooltipTrigger>
                                        <div className='flex items-center hover:transform hover:scale-110 transition-all' onClick={() => setReplyToId(m.messageID)}>
                                            <ReplyIcon size={16}/>
                                        </div>
                                        <TooltipContent>
                                            Reply
                                        </TooltipContent>
                                    </TooltipTrigger>
                                    </Tooltip>
                
                                    <Tooltip delayDuration={10}>
                                    <TooltipTrigger>
                                        <div className='flex items-center hover:transform hover:scale-110 transition-all'>
                                            <CopyIcon size={16}/>
                                        </div>
                                        <TooltipContent>
                                            Copy
                                        </TooltipContent>
                                    </TooltipTrigger>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                    </div>
                    </div>
                ))} 
            </div>
        </div>
    );
};

export default RenderChatMessage;
