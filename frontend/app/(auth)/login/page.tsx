"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"
import ReCAPTCHA from "react-google-recaptcha"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [captchaToken, setCaptchaToken] = useState(null)
  const [message, setMessage] = useState("")

  const handleLogin = async () => {
    if (!captchaToken) {
      setMessage("Please verify captcha")
      return
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
      return
    }

    if (data.user) {
      router.push("/sports")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow w-96">
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="border w-full p-2 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border w-full p-2 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* CAPTCHA */}
        <div className="mb-4 flex justify-center">
          <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
          onChange={(token) => setCaptchaToken(token)}
        />

        </div>

        <button
          onClick={handleLogin}
          className="bg-black text-white w-full p-2 rounded mb-4"
        >
          Login
        </button>

        {message && (
          <p className="mt-4 text-sm text-red-600">{message}</p>
        )}
      </div>
    </div>
  )
}
