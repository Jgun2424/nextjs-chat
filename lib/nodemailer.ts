import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILEREMAIL, // Replace with your Gmail address
        pass: process.env.NODEMAILERPASS, // Replace with your Gmail password or App Password if 2FA is enabled
    },
});
export { transporter };