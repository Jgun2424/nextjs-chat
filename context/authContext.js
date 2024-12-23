'use client'
import { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged, signOut as authSignOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getDoc, doc, setDoc, getDocs, collection, query, where, serverTimestamp, arrayUnion, updateDoc, arrayRemove } from 'firebase/firestore'
import { auth, db } from '../firebaseConfig';
import { usePathname, useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                router.push('/auth/login');
                setUser(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const signOut = async () => {
        if (pathname.includes('chat')) {
            router.push('/auth/login');
        }

        await authSignOut(auth);
        router.refresh();
    };

    const getUserFromDatabase = async (uid) => {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setUserDetails(docSnap.data());
            setLoading(false);
            return docSnap.data();
        } else {
            return null;
        }
    }

    const createNewUser = async (user) => {
        const userRef = doc(db, 'users', user.uid);
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || null,
            searchAbleDisplayName: user.displayName.toLowerCase() || null,
            photoURL: user.photoURL || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        await setDoc(userRef, userData);
    }

    const getChatDetails = async (uid) => {
        const docRef = doc(db, 'chats', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return null;
        }
    }

    const searchForUser = async (displayName) => {
        const usersRef = collection(db, 'users');
        const searchTerm = displayName.toLowerCase();

        if (searchTerm.length <= 2) return [];

        const q = query(
            usersRef,
            where('searchAbleDisplayName', '>=', searchTerm),
            where('searchAbleDisplayName', '<=', searchTerm + '\uf8ff')
        );

        try {
            const snapshot = await getDocs(q);
            if (snapshot.empty) {
                console.log('No matching documents.');
                return [];
            }

            return snapshot.docs.map(doc => doc.data());
        } catch (error) {
            console.error('Error searching for users:', error);
            return [];
        }
    }

    const createNewChat = async (uid, otherUid) => {

        const existingChatsQuery = query(
            collection(db, 'chats'),
            where('chatUsers', 'array-contains', uid)
        );

        const querySnapshot = await getDocs(existingChatsQuery);
        const existingChat = querySnapshot.docs.find(doc => 
            doc.data().chatUsers.includes(otherUid) && doc.data().chatUsers.length === 2
        );

        if (existingChat) {
            router.push(`/chat/${existingChat.id}`);
            return;
        }

        const chatRef = doc(collection(db, 'chats'));
        const chatData = {
            chatID: chatRef.id,
            chatUsers: [uid, otherUid],
            lastChat: "Welcome to the chat!",
            lastChatSender: "System",
            lastMessageTime: serverTimestamp(),
            messages: [],
        }

        try {
            await setDoc(chatRef, chatData);
            router.push(`/chat/${chatRef.id}`);
        } catch (error) {
            console.error('Error creating chat:', error);
            return null;
        }
    }

    const addUserToChat = async (chatID, uid) => {
        const chatRef = doc(db, 'chats', chatID);
        const user = await getUserFromDatabase(uid);
        const chatData = await getChatDetails(chatID);

        if (chatData.chatUsers.includes(uid)) return;

        const newData = {
            chatUsers: arrayUnion(uid),
            lastChat: "User has joined the chat!",
            messages: arrayUnion({ text: `Hey Hey! ${user.displayName} has joined the chat!`, senderID: "system", time: new Date().toISOString() }),
            lastMessageTime: serverTimestamp()
        }

        if (chatData.isGroupChat) {
            try {
                await updateDoc(chatRef, newData);
            } catch (error) {
                console.error('Error adding user to chat:', error);
            }
        } else {
            try {
                await updateDoc(chatRef, {
                    ...newData,
                    isGroupChat: true,
                    groupName: `Unnamed Group Chat`
                });
            } catch (error) {
                console.error('Error adding user to chat:', error);
            }
        }
    }

    const removeUserFromChat = async (chatID, uid, removeCondition) => {
        let message = ``;
        const chatRef = doc(db, 'chats', chatID);
        const user = await getUserFromDatabase(uid);

        if (removeCondition === 'leave') message = `Oh NOO! ${user.displayName} has left the chat!`;
        if (removeCondition === 'remove') message = `Oh NOO! ${user.displayName} has been removed from the chat!`;
        if (removeCondition === undefined) message = `Oh NOO! ${user.displayName} has vanished from the chat!`;

        try {
            await updateDoc(chatRef, {
                chatUsers: arrayRemove(uid),
                lastChat: "User has left the chat!",
                messages: arrayUnion({ text: message, senderID: "system", time: new Date().toISOString() }),
                lastMessageTime: serverTimestamp()
            });
        } catch (error) {
            console.error('Error removing user from chat:', error);
        }
    }

    const sendMessageAsSystem = async (chatID, message) => {
        const chatRef = doc(db, 'chats', chatID);

        try {
            await updateDoc(chatRef, {
                lastChat: message,
                lastChatSender: "System",
                messages: arrayUnion({ text: message, senderID: "system", time: new Date().toISOString() }),
                lastMessageTime: serverTimestamp()
            });
        } catch (error) {
            console.error('Error sending message as system:', error);
        }
    }
    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        try {
            if (isMobile) {
                const result = await signInWithPopup(auth, provider);

                if (result.user) {
                    const userData = await getUserFromDatabase(result.user.uid);

                    if (userData == null) {
                        await createNewUser(result.user);
                        router.push('/');
                    } else {
                        router.push('/');
                    }
                }
            } else {
                const result = await signInWithPopup(auth, provider);

                if (result.user) {
                    const userData = await getUserFromDatabase(result.user.uid);

                    if (userData == null) {
                        await createNewUser(result.user);
                        router.push('/');
                    } else {
                        router.push('/');
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (user) {
            getUserFromDatabase(user.uid);
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, signOut, signInWithGoogle, userDetails, loading, getChatDetails, getUserFromDatabase, searchForUser, createNewChat, addUserToChat, removeUserFromChat, sendMessageAsSystem }}>
            {loading ? <p>Loading...</p> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);