import { NextRequest, NextResponse } from 'next/server';
import { transporter } from '../../../lib/nodemailer';

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        if (!data.email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        console.log('Sending email to:', data.email);

        const mailOptions = {
            from: `New Message <${process.env.NODEMAILEREMAIL}>`, // Replace with your name and Gmail address
            to: data.email,
            subject: `New Message from ${data.senderName}`,
            html: `
                <p>You have received a new message from <strong>${data.senderName}</strong>:</p>
                <blockquote style="margin: 0; padding: 10px; border-left: 3px solid #ccc; background-color: #f9f9f9;">
                    ${data.senderMessage}
                </blockquote>
                <a href="https://nextjs-chat-vert-three-69.vercel.app/chat/${data.chatId}" style="display: inline-block; padding: 10px 20px; margin-top: 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">View Message</a>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return NextResponse.json({ message: 'Notification sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email: %s', error);
        return NextResponse.json({ error: 'Error sending notification' }, { status: 500 });
    }
}