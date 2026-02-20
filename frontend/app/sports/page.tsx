"use client"

import { useRouter } from "next/navigation"

const sportsList = [
  "Cricket",
  "Football",
  "Badminton",
  "Volleyball",
  "Basketball",
  "Hockey",
  "Table Tennis",
  "Chess",
  "Carom",
  "Swimming",
  "Tennis",
  "Pickleball",
]

// Active Sports
const activeSports = [
  "Cricket",
  "Football",
  "Pickleball",
  "Swimming",
  "Volleyball",
  "Basketball",
  "Badminton",
]

export default function SportsPage() {

  const router = useRouter()

  const handleRegister = () => {
    // Directly go to register page
    router.push("/register-match")
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-10 py-8 space-y-12">

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
        Explore Matches & Tournaments
      </h1>

      {sportsList.map((sport, index) => (
        <div key={index} className="space-y-6">

          <h2 className="text-xl sm:text-2xl font-semibold border-b pb-2">
            {sport}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* SINGLE MATCH CARD */}
            <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 hover:shadow-lg transition">

              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base sm:text-lg font-bold">
                  Single Match
                </h3>

                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    activeSports.includes(sport)
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {activeSports.includes(sport) ? "Active" : "Upcoming"}
                </span>
              </div>

              {activeSports.includes(sport) ? (
                <button
                  onClick={handleRegister}
                  className="bg-black text-white w-full sm:w-auto px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
                >
                  Registration as an Individual or Team
                </button>
              ) : (
                <div className="text-gray-500 text-sm">
                  Registration opening soon.
                </div>
              )}
            </div>

            {/* TOURNAMENT CARD */}
            <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 hover:shadow-lg transition">

              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base sm:text-lg font-bold">
                  Tournament
                </h3>

                <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                  Upcoming
                </span>
              </div>

              <div className="text-gray-500 text-sm">
                Tournament details will be announced soon.
              </div>

            </div>

          </div>

        </div>
      ))}

    </div>
  )
}