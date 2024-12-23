import { cloudinary } from '@/lib/cloudinary';

export async function POST(req: Request) {
    const data = await req.json();

    try {
        const response = await cloudinary.uploader.upload(data.imageData, {
            upload_preset: 'ml_default',
        });

        console.log('Uploaded image:', response.secure_url);

        return new Response(JSON.stringify({ secure_url: response.secure_url }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        return new Response(null, { status: 500 });
    }
}
