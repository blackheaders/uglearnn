import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendAdminNotification = async (notification: any) => {
  await resend.emails.send({
    from: 'notifications@yourdomain.com',
    to: "admin@yourdomain.com",
    subject: 'New Payment Notification',
    html: `
      <h2>New Payment Notification</h2>
      <p>Course: ${notification.course.title}</p>
      <p>Amount: Rs. ${notification.amount}</p>
      <p>User: ${notification.user.name}</p>
      <p>Status: ${notification.status}</p>
      <p>Screenshot: <a href="${notification.screenshot}">View Screenshot</a></p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/notifications">View in Dashboard</a>
    `
  });
};
