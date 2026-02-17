"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"

export default function RegisterTurf() {
  const router = useRouter()

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    district: "",
    state: "",
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async () => {
    setLoading(true)
    setMessage("")

    const { error } = await supabase.from("turfs").insert({
      name: form.name,
      mobile: form.mobile,
      district: form.district,
      state: form.state,
      role: "turf",
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    setMessage("Turf registered successfully!")
    setLoading(false)

    setTimeout(() => {
      router.push("/sports")
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl w-96 shadow space-y-4">

        <h1 className="text-2xl font-bold">Register Your Turf</h1>

        <input
          placeholder="Turf Name"
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
          {loading ? "Saving..." : "Register Turf"}
        </button>

        {message && (
          <p className="text-green-600 text-sm">{message}</p>
        )}
      </div>
    </div>
  )
}
