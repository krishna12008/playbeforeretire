"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase-client"

export default function RegisterTurf() {
  const router = useRouter()

  const [form, setForm] = useState({
    turfName: "",
    contactPerson: "",
    mobile: "",
    email: "",
    district: "Lucknow",
    location: "Gomti Nagar",
    address: "",
    grounds: "",
  })

  const handleSubmit = async () => {
    const { error } = await supabase.from("turf_requests").insert({
      turf_name: form.turfName,
      contact_person: form.contactPerson,
      mobile: form.mobile,
      email: form.email,
      district: form.district,
      location: form.location,
      address: form.address,
      grounds: Number(form.grounds),
    })

    if (error) {
      alert("Something went wrong")
      console.log(error)
      return
    }

    alert("Registration submitted successfully! We will contact you soon.")
    router.push("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-6">
          Register Your Turf
        </h1>

        <div className="space-y-4">

          <input
            placeholder="Turf Name"
            className="border w-full p-2 rounded"
            onChange={(e) => setForm({ ...form, turfName: e.target.value })}
          />

          <input
            placeholder="Contact Person"
            className="border w-full p-2 rounded"
            onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
          />

          <input
            placeholder="Mobile No"
            className="border w-full p-2 rounded"
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          />

          <input
            placeholder="Email"
            className="border w-full p-2 rounded"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <select
            className="border w-full p-2 rounded"
            onChange={(e) => setForm({ ...form, district: e.target.value })}
          >
            <option>Lucknow</option>
          </select>

          <select
            className="border w-full p-2 rounded"
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          >
            <option>Gomti Nagar</option>
          </select>

          <input
            placeholder="Full Address"
            className="border w-full p-2 rounded"
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          <input
            placeholder="Number of Grounds"
            type="number"
            className="border w-full p-2 rounded"
            onChange={(e) => setForm({ ...form, grounds: e.target.value })}
          />

          <button
            onClick={handleSubmit}
            className="bg-black text-white w-full p-2 rounded-lg mt-4 hover:bg-gray-800 transition"
          >
            Register Turf
          </button>

        </div>
      </div>
    </div>
  )
}
