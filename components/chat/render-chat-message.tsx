import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import moment from 'moment';
import { Badge } from '../ui/badge';
import UserCard from './user-card';

interface RenderChatMessageProps {
    message: [{ text: string; imageUrl?: string | null }];
    senderDisplayName: string;
    timestamp: string;
    senderID: string;
    senderPhotoURL: string | null;
}

const RenderChatMessage: React.FC<RenderChatMessageProps> = ({
    message,
    senderDisplayName,
    timestamp,
    senderID,
    senderPhotoURL,
}) => {

    console.log(message);
    return (
        <div className="flex bg-sidebar px-4 py-2">
            <Avatar className='object-cover'>
                <AvatarImage src={senderPhotoURL || undefined} className='object-cover'/>
                <AvatarFallback>{senderDisplayName[0] || 'U'}</AvatarFallback>
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
                {message.map((m, idx) => (
                    <div key={idx}>
                        {
                            m.imageUrl ? (
                                <img 
                                    src={m.imageUrl} 
                                    alt="chat-image" 
                                    className="w-40 h-40 object-cover rounded-md mt-2 mb-1 sm:w-80 sm:h-80" 
                                />
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
