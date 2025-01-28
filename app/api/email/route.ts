import nodemailer from "nodemailer";

export async function POST(request: Request) {
    const { walletAddress, walletNetwork, stakeAddress } = await request.json();
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'emirolgun@gmail.com',
        subject: 'Token Request',
        text: 'You have a new token request from stake address ' + stakeAddress + ' on ' + walletNetwork
    };

    try {
        await transporter.sendMail(mailOptions);
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false }), {
            status: 500,
        });
    }
}