import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import connectToDatabase from '@/lib/mongodb'
import { Message } from '@/models/Message'

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json()

    // 1. Save to MongoDB
    await connectToDatabase()
    await Message.create({ name, email, subject, message })

    // 2. Send Email via Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'mahekkasdekar@gmail.com',
      replyTo: email,
      subject: `Portfolio Contact: ${subject}`,
      text: `You have received a new message from ${name} (${email}):\n\n${message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #1a1a2e; margin-bottom: 5px;">New Portfolio Message</h2>
          <p style="color: #6b6b8a; font-size: 14px; margin-top: 0;">from <strong>${name}</strong> (${email})</p>
          <hr style="border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <h3 style="color: #9b4f6a;">Subject: ${subject}</h3>
          <p style="color: #1a1a2e; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
      `,
    }

    // Only attempt to send if EMAIL_PASS is configured (prevents crash during development if not set)
    if (process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions)
    }

    return NextResponse.json({ success: true, message: 'Message saved and sent successfully' }, { status: 200 })
  } catch (error) {
    console.error('Contact API Error:', error)
    return NextResponse.json({ success: false, message: 'Failed to process request' }, { status: 500 })
  }
}
