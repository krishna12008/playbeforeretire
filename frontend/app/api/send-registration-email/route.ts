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

    // ================= UNIFIED REGISTRATION =================
    const emailText = `
🚨 New Match Registration Received

Register Type: ${body.register_type}

${body.register_type === "Team" ? `Your Name: ${body.your_name}` : ""}

Full Name: ${body.full_name}
Email: ${body.email}
WhatsApp: ${body.whatsapp_number}
Sport: ${body.sport}
Player Type: ${body.player_type ?? "-"}
Turf: ${body.turf_name}

Submitted At: ${new Date().toLocaleString()}
`

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "playbeforeretire@gmail.com",
      subject: "🚨 Play Before Retire - New Registration",
      text: emailText,
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Email failed" }, { status: 500 })
  }
}