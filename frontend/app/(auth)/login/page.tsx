"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"
import ReCAPTCHA from "react-google-recaptcha"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  // ✅ Redirect if already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        router.push("/sports")
      }
    }
    checkUser()
  }, [router])

  // ✅ Email Login
  const handleLogin = async () => {
    setMessage("")

    if (!captchaToken) {
      setMessage("Please verify captcha")
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setMessage(error.message)
      return
    }

    if (data.user) {
      router.push("/sports")
    }
  }

  // ✅ Google Login
  const handleGoogleLogin = async () => {
    setLoading(true)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/sports`,
      },
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 sm:p-8 rounded shadow w-full max-w-md mx-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="border w-full p-2 mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="border w-full p-2 mb-4 rounded"
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

        {/* Email Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-black text-white w-full p-2 rounded mb-3 hover:bg-gray-800 transition"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="px-3 text-sm text-gray-500">OR</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="bg-red-500 text-white w-full p-2 rounded hover:bg-red-600 transition"
        >
          Continue with Google
        </button>

        {/* Error Message */}
        {message && (
          <p className="mt-4 text-sm text-red-600 text-center">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
