import { useState, useEffect } from 'react';
import { query, collection, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/authContext';

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
                        const usersKey = `chat-users-cache-${doc.id}`;
                        let otherUserDetails;
                    
                        if (localStorage.getItem(usersKey)) {
                            const cachedUsers = JSON.parse(localStorage.getItem(usersKey) as string);
                            otherUserDetails = cachedUsers.find((cachedUser: any) => cachedUser.uid !== user.uid);
                        } else {
                            const otherUser = await getUserFromDatabase(chatData.chatUsers.find((chatUser: string) => chatUser !== user.uid));
                            localStorage.setItem(usersKey, JSON.stringify([otherUser]));
                            otherUserDetails = otherUser;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, user]);

    useEffect(() => {
        if (chats.length > 0) {
            const sorted = [...chats].sort((a, b) => b.lastMessageTime?.toDate() - a.lastMessageTime?.toDate());
            setSortedChats(sorted);
        }
    }, [chats]);

    return { sortedChats };
};