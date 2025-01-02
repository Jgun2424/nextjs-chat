import axios from "axios";
export const sendNotification = async (email: string, senderName: string, senderMessage: string, chatId: string) => {
    
    try {
        const response = await axios.post('/api/notify', { email, senderName, senderMessage, chatId });
        return response.data;
    } catch (error) {
        console.error('Error sending notification:', error);
        return null;
    }
};