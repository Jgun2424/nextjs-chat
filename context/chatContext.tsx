import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { db } from '@/firebaseConfig';
import { onSnapshot, doc, getDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { useAuth } from './authContext';
import { ChatSkeleton } from '@/components/chat/chat-skeleton';
import { uploadImage } from '@/utils/uploadImage';
import moment from 'moment';

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

interface ChatContextType {
    setChatId: (id: string) => void;
    setReplyToId: (id: string | null) => void;
    sendMessage: (message: string, image: File | null) => Promise<{ success: boolean; error?: any }>;
    replyToId: string | null;
    rawMessages: Message[];
    chatId: string | null;
    messages: GroupedMessages[];
    chatUsers: ChatUser[];
}

interface ChatUser {
    uid: string;
    displayName: string;
    photoURL: string;
}


// Create the context with a default value
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Create a provider component
interface ChatProviderProps {
    children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
    const { user, getUserFromDatabase } = useAuth();
    const [messages, setMessages] = useState<GroupedMessages[]>([]);
    const [rawMessages, setRawMessages] = useState<Message[]>([]);
    const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
    const [chatId, setChatId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [replyToId, setReplyToId] = useState<string | null>(null);

    const getChatUsers = async () => {
        setIsLoading(true);
        if (!chatId) return;
        const usersKey = `chat-users-cache-${chatId}`;
        const getChatData = getDoc(doc(db, 'chats', chatId));
        const chatData = await getChatData;

        if (chatData.exists()) {
            const chat = chatData.data();

            const users = chat.chatUsers;
            const userData = await Promise.all(
                users.map(async (uid: string) => {
                    const user = await getUserFromDatabase(uid);
                    return user;
                })
            );
            localStorage.setItem(usersKey, JSON.stringify(userData as ChatUser[]));
            setChatUsers(userData as ChatUser[]);
            setIsLoading(false);
        }
    }


    const groupMessages = (messages: Message[]) => {
        const time_threshold = 3;

        const groupedMessages = messages.reduce((acc: GroupedMessages[], message) => {
            const lastMessage = acc[acc.length - 1];
            const lastMessageTime = lastMessage?.messages[lastMessage.messages.length - 1]?.timestamp;
            const currentMessageTime = message.timestamp;

            const timeDifference = moment(currentMessageTime).diff(moment(lastMessageTime), 'minutes');
            if (!lastMessage || 
                lastMessage.senderID !== message.senderID || 
                timeDifference > time_threshold || lastMessage?.messages[lastMessage.messages.length - 1].isReply !== message.isReply
            ) {
                acc.push({
                    senderID: message.senderID,
                    senderDisplayName: `${chatUsers.find(user => user.uid === message.senderID)?.displayName}`,
                    senderPhotoURL: `${chatUsers.find(user => user.uid === message.senderID)?.photoURL}`,
                    timestamp: new Date(message.timestamp),
                    messages: [message]
                });
            } else {
                lastMessage.messages.push(message);
            }
            return acc;
        }, []);

        return groupedMessages;
    }


    const sendMessage = async (message: string, image: File | null) => {
        if (!message.trim()) return { success: false, error: 'Empty message' };
        
        let imageUrl = null;
    
        if (image) {
            const uploadedImage = await uploadImage(image);
            imageUrl = uploadedImage.secure_url;
        }
    
        const newMessage: Message = {
            messageID: crypto.randomUUID(),
            senderID: user?.uid as string,
            senderDisplayName: user?.displayName as string,
            senderPhotoURL: user?.photoURL as string,
            text: message.trim(),
            imageUrl: imageUrl,
            isReply: replyToId ? true : false,
            replyToId: replyToId,
            timestamp: new Date().toISOString(),
        };
    
        try {
            await updateDoc(doc(db, 'chats', chatId as string), {
                lastChat: newMessage.text,
                lastChatSenderID: newMessage.senderID,
                lastMessageTime: serverTimestamp(),
                messages: arrayUnion(newMessage),
            });
            return { success: true };
        } catch (error) {
            return { success: false, error };
        }
    };

    const userDoesntExistInChat = (uid: string) => {
        
    }
    


    useEffect(() => {
        if (!user || !chatId) return;

        const usersKey = `chat-users-cache-${chatId}`;
        if (localStorage.getItem(usersKey)) {
            const cachedUsers = localStorage.getItem(usersKey) as string;
            setChatUsers(JSON.parse(cachedUsers) as ChatUser[]);
        } else {
            getChatUsers();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatId, user]);


    useEffect(() => {
        if (!chatId || !chatUsers || isLoading) return;

        const unsubscribe = onSnapshot(doc(db, 'chats', chatId), (doc) => {
            if (doc.exists()) {
                const chatData = doc.data();
                const messages = chatData.messages as Message[];
                setRawMessages(messages);
                setMessages(groupMessages(messages));

                if (localStorage.getItem(`chat-users-cache-${chatId}`)) {
                    const cachedUsers = JSON.parse(localStorage.getItem(`chat-users-cache-${chatId}`) as string);
                    const chatUsers = doc.data().chatUsers as string[];

                    if (cachedUsers.length !== chatUsers.length) {
                        getChatUsers();
                    }
                } else {
                    console.log('No cached users');
                    getChatUsers();
                }
            }
        });

        return () => unsubscribe();
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatId, chatUsers, isLoading]);


    

    return (
        <ChatContext.Provider value={{ messages, setChatId, chatId, chatUsers, sendMessage, setReplyToId, replyToId, rawMessages }}>
            {isLoading ? <ChatSkeleton /> : children}
        </ChatContext.Provider>
    );
}

// Custom hook to use the chat context
export function useChat() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}