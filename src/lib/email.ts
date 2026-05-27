"use strict";

import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

// Fallback to mock sender if API key is missing (for local testing/dev builds)
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const GYM_EMAIL_SENDER = "U7 Fitness Gym <noreply@u7fitness.com>";
const GYM_ADDRESS = "Near Solanki Chowk Palam Colony, New Delhi - 110045";

export async function sendWelcomeEmail(to: string, name: string) {
  if (!resend) {
    console.warn(`[Mock Email] Welcome email not sent (RESEND_API_KEY missing). Recipient: ${to}, Name: ${name}`);
    return { success: true, mock: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: GYM_EMAIL_SENDER,
      to,
      subject: "Welcome to U7 Fitness Gym!",
      html: `
        <div style="background-color: #000; color: #fff; font-family: sans-serif; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #222;">
          <h2 style="color: #ef4444; font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px;">U7 FITNESS GYM</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #ddd;">Hello <strong>${name}</strong>,</p>
          <p style="font-size: 14px; line-height: 1.6; color: #bbb;">Welcome to the U7 Fitness Gym family! We are thrilled to support you on your fitness journey.</p>
          <div style="background-color: #111; border: 1px solid #333; padding: 15px; border-radius: 8px; margin: 25px 0;">
            <p style="margin: 0; font-size: 14px; color: #eee;"><strong>Gym Address:</strong> ${GYM_ADDRESS}</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #eee;"><strong>Timings:</strong> Morning 05:00 AM - 10:00 AM, Evening 04:00 PM - 10:00 PM (Sunday Closed)</p>
          </div>
          <p style="font-size: 14px; line-height: 1.6; color: #bbb;">You can now log in to your Member Portal to register lift PRs, follow weight metrics, and view payment receipt schedules.</p>
          <hr style="border: 0; border-top: 1px solid #222; margin: 30px 0;">
          <p style="font-size: 11px; color: #666; text-align: center; margin: 0;">&copy; ${new Date().getFullYear()} U7 Fitness Gym. All rights reserved.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend welcome email error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Resend welcome email exception:", err);
    return { success: false, error: err.message };
  }
}

export async function sendPaymentSuccessEmail(to: string, name: string, amount: number, nextDueDate: Date) {
  if (!resend) {
    console.warn(`[Mock Email] Payment success email not sent (RESEND_API_KEY missing). Recipient: ${to}, Amount: ₹${amount}`);
    return { success: true, mock: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: GYM_EMAIL_SENDER,
      to,
      subject: "Fee Payment Receipt - U7 Fitness Gym",
      html: `
        <div style="background-color: #000; color: #fff; font-family: sans-serif; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #222;">
          <h2 style="color: #ef4444; font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px;">Payment Receipt</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #ddd;">Hello <strong>${name}</strong>,</p>
          <p style="font-size: 14px; line-height: 1.6; color: #bbb;">Thank you for your recent payment. Your membership has been successfully updated.</p>
          <div style="background-color: #111; border: 1px solid #333; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <table style="width: 100%; font-size: 14px; color: #eee; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #888;">Amount Paid:</td>
                <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #10b981;">₹${amount}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #888;">Renewal Date:</td>
                <td style="padding: 6px 0; text-align: right; font-weight: bold;">${new Date().toLocaleDateString()}</td>
              </tr>
              <tr style="border-top: 1px solid #222;">
                <td style="padding: 10px 0 6px 0; color: #888; font-weight: bold;">Next Membership Due Date:</td>
                <td style="padding: 10px 0 6px 0; text-align: right; font-weight: bold; color: #ef4444;">${new Date(nextDueDate).toLocaleDateString()}</td>
              </tr>
            </table>
          </div>
          <p style="font-size: 14px; line-height: 1.6; color: #bbb;">Please remember to log your daily check-in attendance at Solanki Chowk branch on each visit!</p>
          <hr style="border: 0; border-top: 1px solid #222; margin: 30px 0;">
          <p style="font-size: 11px; color: #666; text-align: center; margin: 0;">&copy; ${new Date().getFullYear()} U7 Fitness Gym. ${GYM_ADDRESS}</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend payment email error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Resend payment email exception:", err);
    return { success: false, error: err.message };
  }
}

export async function sendDueReminderEmail(to: string, name: string, dueDate: Date) {
  if (!resend) {
    console.warn(`[Mock Email] Due reminder email not sent (RESEND_API_KEY missing). Recipient: ${to}, Due: ${dueDate}`);
    return { success: true, mock: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: GYM_EMAIL_SENDER,
      to,
      subject: "Membership Expiration Warning - U7 Fitness Gym",
      html: `
        <div style="background-color: #000; color: #fff; font-family: sans-serif; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #222;">
          <h2 style="color: #ef4444; font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px;">Membership Reminder</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #ddd;">Hello <strong>${name}</strong>,</p>
          <p style="font-size: 14px; line-height: 1.6; color: #bbb;">This is a friendly reminder that your active U7 Fitness Gym membership is due for renewal on <strong>${new Date(dueDate).toLocaleDateString()}</strong>.</p>
          <div style="background-color: #111; border: 1px solid #ef4444/20; padding: 15px; border-radius: 8px; margin: 25px 0; border: 1px solid #ef4444;">
            <p style="margin: 0; font-size: 14px; color: #fff; text-align: center; font-weight: bold;">
              Renewal Due Date: ${new Date(dueDate).toLocaleDateString()}
            </p>
          </div>
          <p style="font-size: 14px; line-height: 1.6; color: #bbb;">To avoid any disruption in checking in for your training sessions, please pay the renewal fee of ₹1200 (Gym Only) or ₹1500 (Cardio + Gym) to the admin at Solanki Chowk counter.</p>
          <hr style="border: 0; border-top: 1px solid #222; margin: 30px 0;">
          <p style="font-size: 11px; color: #666; text-align: center; margin: 0;">U7 Fitness Gym • Solanki Chowk, Palam Colony</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend due email error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Resend due email exception:", err);
    return { success: false, error: err.message };
  }
}
