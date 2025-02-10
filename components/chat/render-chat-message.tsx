import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import moment from 'moment';
import UserCard from './user-card';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
  } from "@/components/ui/dialog"

  interface Message {
    messageID: string;
    senderID: string;
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

    
    const { messages, senderID, senderDisplayName, senderPhotoURL, timestamp } = props;

    console.log(messages)



    return (
        <div className="flex bg-sidebar px-4 py-2">
            <Avatar className='object-cover'>
                <AvatarImage src={senderPhotoURL || undefined} className='object-cover'/>
                <AvatarFallback>{'U'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col ml-3">
                <div className="flex gap-2 items-center">
                    <span className="text-md font-semibold hover:underline cursor-pointer">
                        <UserCard senderDisplayName={senderDisplayName} senderID={senderID} />
                    </span>
                    <span className="text-sm text-muted-foreground">
                        {timestamp ? moment(timestamp).calendar() : ''}
                    </span>
                </div>
                {messages.map((m, idx) => (
                    <div key={idx}>
                        {
                            m.imageUrl ? (
                                <Dialog>
                                    <DialogTrigger>
                                        
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={m.imageUrl}
                                            alt="chat-image"
                                            className="w-40 h-40 object-cover rounded-md mt-2 mb-1 sm:w-80 sm:h-80"
                                        />
                                    </DialogTrigger>

                                    <DialogContent className='max-w-[55vh] overflow-hidden'>
                                     {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                                src={m.imageUrl}
                                                alt="chat-image"
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                    </DialogContent>
                                </Dialog>
                            ) : null
                        }
                        <p className={/^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])+$/.test(m.text) ? 'text-[40px] pt-2': 'break-all'}>
                            {m.text}
                        </p>
                    </div>
                ))} 
            </div>
        </div>
    );
};

export default RenderChatMessage;
