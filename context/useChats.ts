import { useState, useEffect } from 'react';
import { query, collection, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from './authContext';

interface Chat {
    id: string;
    chatUsers: string[];
    lastChat: string;
    lastMessageTime: any;
    lastChatSenderID: string;
    otherUser: any;
}

export const useChats = () => {
    const { user, userDetails, getUserFromDatabase, loading } = useAuth();
    const [chats, setChats] = useState<Chat[]>([]);
    const [sortedChats, setSortedChats] = useState<Chat[]>([]);

    useEffect(() => {
        if (!loading && user) {
            const userCache = new Map();

            const q = query(collection(db, "chats"), where("chatUsers", "array-contains", user.uid));

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                Promise.all(
                    querySnapshot.docs.map(async (doc) => {
                        const chatData = doc.data();

                        const otherUserId = chatData.chatUsers.find(
                            (uid: string) => uid !== user.uid
                        );

                        let otherUserDetails = null;

                        if (otherUserId) {
                            otherUserDetails = await getUserFromDatabase(otherUserId);
                            if (otherUserDetails) {
                                userCache.set(otherUserId, otherUserDetails);
                                otherUserDetails = userCache.get(otherUserId);
                            }
                        }

                        return {
                            id: doc.id,
                            chatUsers: chatData.chatUsers,
                            lastChat: chatData.lastChat,
                            lastMessageTime: chatData.lastMessageTime,
                            lastChatSenderID: chatData.lastChatSenderID,
                            otherUser: otherUserDetails
                        };
                    })
                ).then((fetchedChats) => {
                    const validChats = fetchedChats.filter((chat) => chat !== null);
                    setChats(validChats);
                });
            });

            return () => {
                unsubscribe();
                userCache.clear();
            };
        }
    }, [loading, user]);

    useEffect(() => {
        if (chats.length > 0) {
            const sorted = [...chats].sort((a, b) => b.lastMessageTime?.toDate() - a.lastMessageTime?.toDate());
            setSortedChats(sorted);
        }
    }, [chats]);

    return { sortedChats };
};