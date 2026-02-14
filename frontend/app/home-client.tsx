"use client"

import { useRouter } from "next/navigation"

const sports = [
  { name: "Cricket", slug: "cricket", icon: "🏏" },
  { name: "Football", slug: "football", icon: "⚽" },
  { name: "Badminton", slug: "badminton", icon: "🏸" },
  { name: "Volleyball", slug: "volleyball", icon: "🏐" },
  { name: "Basketball", slug: "basketball", icon: "🏀" },
  { name: "Hockey", slug: "hockey", icon: "🏑" },
  { name: "Table Tennis", slug: "table-tennis", icon: "🏓" },
  { name: "Chess", slug: "chess", icon: "♟️" },
  { name: "Carom", slug: "carom", icon: "🎯" },
  { name: "Swimming", slug: "swimming", icon: "🏊" },
]

export default function HomeClient() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">

      <div className="flex-1 flex flex-col justify-center px-8 py-12 bg-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Play Before Retire
        </h1>

        <p className="text-gray-600 text-lg mb-6">
          Thinking about playing but don’t know how to start?
        </p>

        <p className="text-gray-600 text-lg mb-8">
          No need to worry — we arrange everything:
          place, team, venue, equipment, umpire & scorer.
        </p>

        <button
          onClick={() => router.push("/sport/cricket")}
          className="bg-black text-white px-6 py-3 rounded-lg w-fit hover:bg-gray-800 transition"
        >
          Start with Cricket
        </button>
      </div>

      <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-6 p-8">
        {sports.map((sport, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center justify-between hover:shadow-lg transition cursor-pointer"
            onClick={() => router.push(`/sport/${sport.slug}`)}
          >
            <div className="text-4xl mb-4">{sport.icon}</div>

            <h3 className="font-semibold text-lg mb-3">
              {sport.name}
            </h3>

            <button className="bg-black text-white px-4 py-2 rounded-md text-sm">
              Play Now
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
