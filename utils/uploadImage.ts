import axios from 'axios';

export async function uploadImage(imageData: any): Promise<string | null> {
    try {
        const response = await axios.post('/api/upload', { imageData });
        return response.data.secure_url;
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
}
