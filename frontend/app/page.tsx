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
    <div className="relative min-h-screen bg-gradient-to-br from-black to-gray-900 text-white">

      {/* HERO SECTION */}
      <div className="flex flex-col lg:flex-row items-center justify-between px-4 sm:px-8 lg:px-16 pt-10 pb-16 gap-12">

        {/* LEFT CONTENT */}
        <div className="max-w-xl text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Play Before Retire
          </h1>

          <p className="text-base sm:text-lg text-gray-300 mb-4">
            Thinking about life after 9 to 5?
          </p>

          <p className="text-sm sm:text-lg text-gray-400 mb-8 leading-relaxed">
            We build your team.
            We arrange the ground.
            We provide equipment.
            We manage matches.
            You just show up and play.
          </p>

          <button
            onClick={() => router.push("/sports")}
            className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition w-full sm:w-auto"
          >
            Get Started
          </button>
        </div>

        {/* SPORTS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-lg">
          {sports.map((sport) => (
            <div
              key={sport.slug}
              onClick={() => router.push("/sports")}
              className="bg-white text-black p-4 sm:p-6 rounded-xl text-center font-semibold hover:scale-105 transition cursor-pointer"
            >
              <div className="text-2xl sm:text-3xl mb-2">
                {sport.icon}
              </div>
              <div className="text-sm sm:text-base">
                {sport.name}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
