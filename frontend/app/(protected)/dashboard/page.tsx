"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()

  // ================= USER DATA =================
  const [individualData, setIndividualData] = useState<any[]>([])
  const [teamData, setTeamData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // ================= CHALLENGE STATE =================
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedVenue, setSelectedVenue] = useState("")
  const [challengeMessage, setChallengeMessage] = useState("")

  // ================= FAKE TEAMS WITH LOCAL LOGOS =================
  const challengeTeams = [
    { name: "Nawab Strikers", logo: "/logos/team1.png", record: "8W - 2L" },
    { name: "Gomti Warriors", logo: "/logos/team2.png", record: "6W - 4L" },
    { name: "Ganj Titans", logo: "/logos/team3.png", record: "9W - 1L" },
    { name: "Sushant Kings", logo: "/logos/team4.png", record: "5W - 5L" },
    { name: "Kisan Hawks", logo: "/logos/team5.png", record: "7W - 3L" },
    { name: "Indira Blasters", logo: "/logos/team6.png", record: "4W - 6L" },
    { name: "Arjunganj Panthers", logo: "/logos/team7.png", record: "6W - 4L" },
    { name: "Kamta Royals XI", logo: "/logos/team8.png", record: "3W - 7L" },
  ]

  // ================= FETCH USER DATA =================
  useEffect(() => {
    const fetchData = async () => {
      const { data: userData } = await supabase.auth.getUser()

      if (!userData?.user) {
        router.push("/login")
        return
      }

      const { data: individual } = await supabase
        .from("individual_registrations")
        .select("*")
        .eq("user_id", userData.user.id)

      const { data: team } = await supabase
        .from("team_registrations")
        .select("*")
        .eq("user_id", userData.user.id)

      setIndividualData(individual || [])
      setTeamData(team || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-2xl sm:text-3xl font-bold mb-8">
          My Dashboard
        </h1>

        {/* ================= MAIN GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ================= LEFT SIDE ================= */}
          <div className="lg:col-span-2 space-y-10">

            {/* INDIVIDUAL */}
            <section>
              <h2 className="text-xl font-semibold mb-4">
                Individual Registrations
              </h2>

              {individualData.length === 0 ? (
                <div className="bg-white p-6 rounded-xl shadow text-gray-500">
                  No individual registrations found.
                </div>
              ) : (
                <div className="space-y-4">
                  {individualData.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-5 rounded-xl shadow"
                    >
                      <p><strong>Name:</strong> {item.full_name}</p>
                      <p><strong>Team:</strong> {item.team_name}</p>
                      <p><strong>Role:</strong> {item.player_type}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* TEAM */}
            <section>
              <h2 className="text-xl font-semibold mb-4">
                Team Registrations
              </h2>

              {teamData.length === 0 ? (
                <div className="bg-white p-6 rounded-xl shadow text-gray-500">
                  No team registrations found.
                </div>
              ) : (
                <div className="space-y-6">
                  {teamData.map((team) => (
                    <div
                      key={team.id}
                      className="bg-white p-5 rounded-xl shadow"
                    >
                      <p className="text-lg font-semibold">
                        {team.team_name}
                      </p>
                      <p><strong>Captain:</strong> {team.captain_name}</p>

                      <div className="mt-3">
                        <p className="font-medium mb-2">Players:</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {team.players.map((player: string, index: number) => (
                            <div
                              key={index}
                              className="bg-gray-100 px-3 py-1 rounded-lg text-sm text-center"
                            >
                              {player}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* ================= RIGHT SIDE (CHALLENGE) ================= */}
          <div>
            <section>
              <h2 className="text-xl font-semibold mb-4">
                Challenge a Team
              </h2>

              <div className="space-y-6">
                {challengeTeams.map((team, index) => (
                  <div
                    key={index}
                    className="bg-white p-5 rounded-xl shadow space-y-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={team.logo}
                        alt={team.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold">{team.name}</p>
                        <p className="text-sm text-gray-500">
                          Record: {team.record}
                        </p>
                      </div>
                    </div>

                    {/* DATE */}
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />

                    {/* TIME */}
                    <input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />

                    {/* VENUE SELECT */}
                    <select
                      value={selectedVenue}
                      onChange={(e) => setSelectedVenue(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="">Select Venue</option>
                      <option>Gomti Nagar Turf</option>
                      <option>Arjunganj Turf</option>
                    </select>

                    <button
                      onClick={() => {
                        if (!selectedDate || !selectedTime || !selectedVenue) {
                          alert("Please select date, time and venue")
                          return
                        }

                        setChallengeMessage(
                          `Challenge sent to ${team.name} on ${selectedDate} at ${selectedTime} at ${selectedVenue}`
                        )
                      }}
                      className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
                    >
                      Send Challenge
                    </button>
                  </div>
                ))}
              </div>

              {challengeMessage && (
                <div className="mt-6 bg-green-100 text-green-700 p-4 rounded-lg">
                  {challengeMessage}
                </div>
              )}
            </section>
          </div>

        </div>
      </div>
    </div>
  )
}
