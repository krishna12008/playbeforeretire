import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "playbeforeretire@gmail.com",
      subject: "🚨 New Match Booking - Play Before Retire",
      text: `
New Booking Received

User Email: ${body.userEmail}
Match: ${body.match}
Date: ${body.date}
Venue: ${body.venue}
Registration Type: ${body.type}
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Email failed" }, { status: 500 })
  }
}
