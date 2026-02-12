"use client"

import { supabase } from "../lib/supabase"
import { useState, useEffect } from "react"

export default function Home() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser()
    setUser(data.user)
  }

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      alert("Check your email for verification link 🚀")
    }
  }

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      alert("Logged in successfully 🎉")
      checkUser()
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (user) {
    return (
      <div style={{ padding: "40px" }}>
        <h1>Welcome 🎉</h1>
        <p>{user.email}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    )
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Play Before Retire</h1>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />

      <button onClick={handleSignup} style={{ marginRight: "10px" }}>
        Sign Up
      </button>

      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  )
}
