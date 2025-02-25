import { Resend } from 'resend';

export async function POST(req: Request) {
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { name, email,subject, message } = await req.json();
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: [`${process.env.CONTACT_EMAIL}`],
            subject: `New Submission - ${subject}`,
            html: `
          <h1>New Contact Form Submission</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong> ${message}</p>
        `,
        });

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Thank you for contacting us!',
            html: `
          <h1>Thank you for your message!</h1>
          <p>We will get back to you soon.</p>
          <p>Best Regards,</p>
          <p>The UGLearn team</p>
        `,
        });
        return new Response(JSON.stringify({ message: 'success' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ message: 'error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}