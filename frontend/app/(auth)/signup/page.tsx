"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase-client"
import ReCAPTCHA from "react-google-recaptcha"

export default function Signup() {
  const router = useRouter()

  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  const [captchaToken, setCaptchaToken] = useState(null)

  const handleSignup = async () => {
    if (!captchaToken) {
      alert("Please verify captcha")
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })

    if (error) {
      alert(error.message)
      return
    }

    if (!data.user) {
      alert("Signup failed")
      return
    }

    router.push("/login/complete-profile")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl w-96 shadow">
        <h1 className="text-2xl font-bold mb-6">Player Signup</h1>

        <input
          placeholder="Email"
          className="border w-full p-2 mb-4"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="border w-full p-2 mb-4"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {/* CAPTCHA */}
        <div className="mb-6 flex justify-center">
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            onChange={(token) => setCaptchaToken(token)}
          />
        </div>

        <button
          onClick={handleSignup}
          className="bg-black text-white w-full p-2 rounded"
        >
          Signup
        </button>
      </div>
    </div>
  )
}
