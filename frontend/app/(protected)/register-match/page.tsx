"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { supabase } from "@/lib/supabase-client"

export default function RegisterMatchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get("type")

  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    try {
      setLoading(true)

      // Get logged-in user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user?.email,
          match: "Cricket Single Match",
          date: "21 Feb 2026 at 12:00 PM",
          venue: "Gomti Nagar, Lucknow",
          type: type === "team" ? "Team (₹2000)" : "Individual (₹200)",
        }),
      })

      setConfirmed(true)
    } catch (error) {
      alert("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (confirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-md text-center space-y-4">
          <h1 className="text-2xl font-bold text-green-600">
            Booking Confirmed
          </h1>
          <p className="text-gray-600">
            Our Team will contact you shortly with your confirmed booking.
          </p>

          <button
            onClick={() => router.push("/sports")}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Back to Sports
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white max-w-lg w-full p-8 rounded-2xl shadow-md space-y-6">

        <h1 className="text-2xl font-bold">
          You’re One Step Away!
        </h1>

        <div className="text-gray-600 space-y-2">
          <p><strong>Match:</strong> Cricket Single Match</p>
          <p><strong>Date:</strong> 21 Feb 2026 at 12:00 PM</p>
          <p><strong>Venue:</strong> Gomti Nagar, Lucknow</p>
          <p>
            <strong>Registration Type:</strong>{" "}
            {type === "team" ? "Team (₹2000)" : "Individual (₹200)"}
          </p>
        </div>

        <div className="flex gap-4">

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Confirm Booking"}
          </button>

          <button
            onClick={() => router.push("/sports")}
            className="border border-black px-6 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>

        </div>

      </div>
    </div>
  )
}
