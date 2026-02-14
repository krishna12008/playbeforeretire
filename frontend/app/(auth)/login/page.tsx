"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignup, setIsSignup] = useState(false)
  const [message, setMessage] = useState("")

  const handleAuth = async () => {
if (isSignup) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    setMessage(error.message)
    return
  }

  if (data.user) {
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: data.user.id,
        role: "individual",
      })

    if (profileError) {
      setMessage(profileError.message)
      return
    }

    setMessage("Check your email for verification link.")
  }
}
 else {
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
})

if (error) {
  setMessage(error.message)
  return
}

if (data.user) {
  // Check if profile already exists
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single()

  if (!profile) {
    await supabase.from("profiles").insert({
      id: data.user.id,
      role: "individual",
    })
  }

  router.push("/sports")
}

    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow w-96">
        <h1 className="text-2xl font-bold mb-6">
          {isSignup ? "Sign Up" : "Login"}
        </h1>

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

        <button
          onClick={handleAuth}
          className="bg-black text-white w-full p-2 rounded mb-4"
        >
          {isSignup ? "Create Account" : "Login"}
        </button>

        <button
          onClick={() => setIsSignup(!isSignup)}
          className="text-sm text-blue-600"
        >
          {isSignup
            ? "Already have an account? Login"
            : "Don't have an account? Sign Up"}
        </button>

        {message && (
          <p className="mt-4 text-sm text-red-600">{message}</p>
        )}
      </div>
    </div>
  )
}
