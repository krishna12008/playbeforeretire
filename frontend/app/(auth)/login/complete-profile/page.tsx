"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"

export default function CompleteProfile() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [mobile, setMobile] = useState("")
  const [state, setState] = useState("Uttar Pradesh")
  const [district, setDistrict] = useState("Lucknow")

  const handleSave = async () => {
    const { data } = await supabase.auth.getUser()

    if (!data?.user) {
      router.push("/login")
      return
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        name,
        mobile,
        state,
        district,
      })
      .eq("id", data.user.id)

    if (error) {
      alert(error.message)
      return
    }

    router.push("/sports")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl w-96 shadow space-y-4">
        <h1 className="text-2xl font-bold mb-4">
          Complete Your Profile
        </h1>

        <input
          placeholder="Full Name"
          className="border w-full p-2"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Mobile Number"
          className="border w-full p-2"
          onChange={(e) => setMobile(e.target.value)}
        />

        {/* State Dropdown */}
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="border w-full p-2"
        >
          <option>Uttar Pradesh</option>
          <option>Delhi</option>
          <option>Maharashtra</option>
        </select>

        {/* District Dropdown */}
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="border w-full p-2"
        >
          <option>Lucknow</option>
          <option>Kanpur</option>
          <option>Varanasi</option>
        </select>

        <button
          onClick={handleSave}
          className="bg-black text-white w-full p-2 rounded mt-2"
        >
          Save Profile
        </button>
      </div>
    </div>
  )
}
