"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import { supabase } from "@/lib/supabase-client"

export default function RegisterMatchPage() {
  const params = useParams()
  const type = params.type as string

  // ================= INDIVIDUAL =================
  const [individualName, setIndividualName] = useState("")
  const [individualWhatsapp, setIndividualWhatsapp] = useState("")
  const [selectedTeam, setSelectedTeam] = useState("")
  const [playerType, setPlayerType] = useState("")

  // ================= TEAM =================
  const [teamName, setTeamName] = useState("")
  const [captainName, setCaptainName] = useState("")
  const [teamWhatsapp, setTeamWhatsapp] = useState("")
  const [players, setPlayers] = useState<string[]>(Array(10).fill(""))

  const [showSuccess, setShowSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const fakeTeams = [
    "Gomti Warriors",
    "Lucknow Titans",
    "Royal Strikers",
    "Thunder Blasters",
    "Champions XI"
  ]

  const handlePlayerChange = (index: number, value: string) => {
    const updated = [...players]
    updated[index] = value
    setPlayers(updated)
  }

  // ================= INDIVIDUAL SUBMIT =================
  const handleIndividualConfirm = async () => {
    setErrorMessage("")

    if (!individualName || !selectedTeam || !playerType || !individualWhatsapp) {
      setErrorMessage("Please fill all fields")
      return
    }

    const { data: userData } = await supabase.auth.getUser()

    if (!userData?.user) {
      setErrorMessage("Login required")
      return
    }

    const { error } = await supabase
      .from("individual_registrations")
      .insert([
        {
          user_id: userData.user.id,
          full_name: individualName,
          team_name: selectedTeam,
          player_type: playerType,
          whatsapp_number: individualWhatsapp,
        },
      ])

    if (error) {
      setErrorMessage("Error saving registration")
      return
    }

    await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: "individual",
        userEmail: userData.user.email,
        full_name: individualName,
        team_name: selectedTeam,
        player_type: playerType,
        whatsapp_number: individualWhatsapp,
      }),
    })

    setShowSuccess(true)
  }

  // ================= TEAM SUBMIT =================
  const handleTeamConfirm = async () => {
    setErrorMessage("")

    if (!teamName || !captainName || !teamWhatsapp) {
      setErrorMessage("All fields are required")
      return
    }

    const filledPlayers = players.filter((p) => p.trim() !== "")
    const totalPlayers = 1 + filledPlayers.length

    if (totalPlayers !== 11) {
      setErrorMessage("Exactly 11 players required (including Captain)")
      return
    }

    const { data: userData } = await supabase.auth.getUser()

    if (!userData?.user) {
      setErrorMessage("Login required")
      return
    }

    const allPlayers = [captainName, ...filledPlayers]

    const { error } = await supabase
      .from("team_registrations")
      .insert([
        {
          user_id: userData.user.id,
          team_name: teamName,
          captain_name: captainName,
          players: allPlayers,
          whatsapp_number: teamWhatsapp,
        },
      ])

    if (error) {
      setErrorMessage("Error saving team registration")
      return
    }

    await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: "team",
        userEmail: userData.user.email,
        team_name: teamName,
        captain_name: captainName,
        players: allPlayers,
        whatsapp_number: teamWhatsapp,
      }),
    })

    setShowSuccess(true)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 sm:p-10">

        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          {type === "team" ? "Team Registration" : "Individual Registration"}
        </h1>

        {showSuccess ? (
          <div className="text-center space-y-4">
            <div className="text-green-600 text-xl font-semibold">
              ✅ Registration Confirmed!
            </div>
            <p className="text-gray-600">
              Our team will contact you on WhatsApp shortly.
            </p>
          </div>
        ) : (
          <>
            {/* ================= INDIVIDUAL ================= */}
            {type === "individual" && (
              <div className="space-y-6">

                <input
                  type="text"
                  placeholder="Full Name"
                  value={individualName}
                  onChange={(e) => setIndividualName(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2"
                />

                <input
                  type="tel"
                  placeholder="WhatsApp Number"
                  value={individualWhatsapp}
                  onChange={(e) => setIndividualWhatsapp(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2"
                />

                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2"
                >
                  <option value="">Select Team</option>
                  {fakeTeams.map((team, index) => (
                    <option key={index} value={team}>
                      {team}
                    </option>
                  ))}
                </select>

                <select
                  value={playerType}
                  onChange={(e) => setPlayerType(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2"
                >
                  <option value="">Select Player Type</option>
                  <option>Batsman</option>
                  <option>Bowler</option>
                  <option>Allrounder</option>
                  <option>Batsman-Keeper</option>
                </select>

                {errorMessage && (
                  <p className="text-red-500 text-sm">{errorMessage}</p>
                )}

                <button
                  onClick={handleIndividualConfirm}
                  className="w-full bg-black text-white py-3 rounded-lg"
                >
                  Confirm Registration
                </button>
              </div>
            )}

            {/* ================= TEAM ================= */}
            {type === "team" && (
              <div className="space-y-6">

                <input
                  type="text"
                  placeholder="Create Team Name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2"
                />

                <input
                  type="text"
                  placeholder="Captain Name"
                  value={captainName}
                  onChange={(e) => setCaptainName(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2"
                />

                <input
                  type="tel"
                  placeholder="Captain WhatsApp Number"
                  value={teamWhatsapp}
                  onChange={(e) => setTeamWhatsapp(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {players.map((player, index) => (
                    <input
                      key={index}
                      type="text"
                      placeholder={`Player ${index + 1}`}
                      value={player}
                      onChange={(e) =>
                        handlePlayerChange(index, e.target.value)
                      }
                      className="border rounded-lg px-4 py-2"
                    />
                  ))}
                </div>

                {errorMessage && (
                  <p className="text-red-500 text-sm">{errorMessage}</p>
                )}

                <button
                  onClick={handleTeamConfirm}
                  className="w-full bg-black text-white py-3 rounded-lg"
                >
                  Confirm Registration
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
