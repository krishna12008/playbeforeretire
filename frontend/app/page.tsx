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
  { name: "Tennis", slug: "tennis", icon: "🎾" },
  { name: "Pickleball", slug: "pickleball", icon: "🥎" },
]

export default function Landing() {
  const router = useRouter()

  return (
    /* REMOVED pt-20 here */
    <div className="relative min-h-screen bg-gradient-to-br from-black to-gray-900 text-white">

      {/* TOP RIGHT NAV BUTTONS */}
      <div className="absolute top-6 right-8 flex gap-4">
        {/* Buttons go here */}
      </div>

      {/* HERO SECTION - CHANGED py-20 to pt-10 pb-20 to reduce top gap */}
      <div className="flex flex-col md:flex-row items-center justify-between px-12 pt-10 pb-20">

        {/* LEFT CONTENT */}
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Play Before Retire
          </h1>

          <p className="text-lg text-gray-300 mb-4">
            Thinking about life after 9 to 5?
          </p>

          <p className="text-lg text-gray-400 mb-8">
            We build your team.
            We arrange the ground.
            We provide equipment.
            We manage matches.
            You just show up and play.
          </p>

          <button
            onClick={() => router.push("/sports")}
            className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Get Started
          </button>
        </div>

        {/* SPORTS GRID */}
        <div className="grid grid-cols-3 gap-6 mt-12 md:mt-0">
          {sports.map((sport) => (
            <div
              key={sport.slug}
              onClick={() => router.push("/sports")}
              className="bg-white text-black p-6 rounded-xl text-center font-semibold hover:scale-105 transition cursor-pointer"
            >
              <div className="text-3xl mb-2">{sport.icon}</div>
              {sport.name}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}