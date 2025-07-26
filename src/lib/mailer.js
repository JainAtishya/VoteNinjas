import nodemailer from 'nodemailer';

export const sendEmail = async ( { to, subject, html}) => {
    try{
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_PORT == 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from:`Mail <${process.env.SMTP_USER}>`,
            to: to,
            subject: subject,
            html: html,
        };

        const mailresponse = await transporter.sendMail(mailOptions);
        return mailresponse;
    } catch (error){
        console.error("Error sending email: ", error);
        throw new Error("Failed to send verification email.");
    }
}