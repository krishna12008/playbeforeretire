"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"

export default function CompleteProfile() {
  const router = useRouter()

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    district: "",
    state: "",
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.push("/login")
      }
    }

    checkUser()
  }, [router])

  const handleSubmit = async () => {
    setLoading(true)

    const { data } = await supabase.auth.getUser()
    const user = data.user

    if (!user) {
      setMessage("User not found")
      setLoading(false)
      return
    }

    const { error } = await supabase.from("profiles").insert({
      id: user.id,
      name: form.name,
      mobile: form.mobile,
      district: form.district,
      state: form.state,
      role: "individual",
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    router.push("/sports")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl w-96 shadow space-y-4">

        <h1 className="text-2xl font-bold">Complete Your Profile</h1>

        <input
          placeholder="Full Name"
          className="border w-full p-2"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Mobile Number"
          className="border w-full p-2"
          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
        />

        <input
          placeholder="District"
          className="border w-full p-2"
          onChange={(e) => setForm({ ...form, district: e.target.value })}
        />

        <input
          placeholder="State"
          className="border w-full p-2"
          onChange={(e) => setForm({ ...form, state: e.target.value })}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-black text-white w-full p-2 rounded disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>

        {message && (
          <p className="text-red-600 text-sm">{message}</p>
        )}
      </div>
    </div>
  )
}
