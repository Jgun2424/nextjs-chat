import { cloudinary } from '@/lib/cloudinary';

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file || !(file instanceof File)) {
        return new Response('No file uploaded', { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const data = { imageData: `data:${file.type};base64,${buffer.toString('base64')}` };

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
