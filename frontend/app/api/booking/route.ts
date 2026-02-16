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

    let emailText = ""

    // ================= MATCH BOOKING =================
    if (body.category === "booking") {
      emailText = `
New Match Booking Received

User Email: ${body.userEmail}
Match: ${body.match}
Date: ${body.date}
Venue: ${body.venue}
Registration Type: ${body.type}
`
    }

    // ================= INDIVIDUAL REGISTRATION =================
    if (body.category === "individual") {
      emailText = `
New Individual Registration

User Email: ${body.userEmail}
Full Name: ${body.full_name}
Team Joined: ${body.team_name}
Player Type: ${body.player_type}
`
    }

    // ================= TEAM REGISTRATION =================
    if (body.category === "team") {
      emailText = `
New Team Registration

User Email: ${body.userEmail}
Team Name: ${body.team_name}
Captain: ${body.captain_name}
Players:
${body.players.join("\n")}
`
    }

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
