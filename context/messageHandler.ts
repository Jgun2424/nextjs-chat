import { useState, useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useAuth } from './authContext';

interface MessageHandlerProps {
    chatId: string;
}

interface GroupedMessage {
    text: string;
    imageUrl: null;
    senderID: string;
    senderDisplayName: string;
    senderPhotoURL: string | null;
    messages: any[];
    timestamp: string;
}

interface User {
    uid: string;
    displayName: string;
    photoURL: string;
}

export const useMessages = ({ chatId }: MessageHandlerProps) => {
    const { user, getChatDetails, getUserFromDatabase } = useAuth();
    const [groupedMessages, setGroupedMessages] = useState<GroupedMessage[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const LOCAL_STORAGE_KEY = `chat-${chatId}`;
    const MESSAGE_GROUP_THRESHOLD = 5 * 60 * 1000;

    useEffect(() => {
        const fetchChat = async () => {
            const chatDetails = await getChatDetails(chatId);

            if (chatDetails) {
                const storedUsers = localStorage.getItem(LOCAL_STORAGE_KEY);
                const users = chatDetails.chatUsers;
                let usersInChat: User[] = [];

                const parsedStoredUsers = storedUsers ? JSON.parse(storedUsers) : null;

                if (!parsedStoredUsers) {
                    const userData = await Promise.all(
                        users.map(async (uid: string) => {
                            console.log("fetching user", uid);
                            const user = await getUserFromDatabase(uid);
                            return user;
                        })
                    );
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
                    usersInChat = userData;
                    setUsers(userData);
                } else {
                    usersInChat = parsedStoredUsers;    
                    setUsers(parsedStoredUsers);    
                }

                const unsubscribe = onSnapshot(doc(db, 'chats', chatId), (doc) => {
                    if (doc.exists()) {
                        const messages = doc.data().messages as GroupedMessage[];

                        const grouped = messages.reduce<GroupedMessage[]>((acc, message) => {
                            const lastGroup = acc[acc.length - 1];
                            const currentTime = new Date(message.timestamp).getTime();
                            const sender = usersInChat.find((user) => user.uid === message.senderID);
                            
                            if (
                                lastGroup &&
                                lastGroup.senderID === message.senderID &&
                                currentTime - new Date(lastGroup.timestamp).getTime() <= MESSAGE_GROUP_THRESHOLD
                            ) {
                                lastGroup.messages.push({ text: message.text, imageUrl: message.imageUrl || null }); // Ensure message is pushed as an object
                                lastGroup.timestamp = message.timestamp;
                            } else {
                                console.log("sender", message);
                                acc.push({
                                    senderID: message.senderID,
                                    senderDisplayName: message.senderID === "system" ? "Gerald" : sender ? sender.displayName : "Unknown",
                                    senderPhotoURL: message.senderID === "system" ? "/gerald.png" : sender ? sender.photoURL : null,
                                    messages: [{
                                        text: message.text,
                                        imageUrl: message.imageUrl || null,
                                    }], // Ensure message is an object
                                    timestamp: message.timestamp,
                                    imageUrl: null,
                                    text: ''
                                });
                            }
                            return acc;
                        }, []);

                        setGroupedMessages(grouped);
                    }
                });

                return () => unsubscribe();
            } else {
                return null;
            }
        };

        if (user && chatId) {
            fetchChat();
        }
    }, [user, chatId]);

    return { groupedMessages };
};
