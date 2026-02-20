"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"
import { supabase } from "@/lib/supabase-client"
import ReCAPTCHA from "react-google-recaptcha"

// SSR safe leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
)

export default function RegisterMatchPage() {

  // Register type
  const [registerType, setRegisterType] = useState("Individual")
  const [yourName, setYourName] = useState("")

  // Common fields
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [selectedSport, setSelectedSport] = useState("")
  const [playerType, setPlayerType] = useState("")
  const [nearbyTurfs, setNearbyTurfs] = useState<any[]>([])
  const [selectedTurf, setSelectedTurf] = useState("")
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null)

  const [flagIcon, setFlagIcon] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [success, setSuccess] = useState(false)

  // Load flag icon only on client
  useEffect(() => {
    import("leaflet").then((L) => {
      const icon = new L.Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
        iconSize: [35, 35],
        iconAnchor: [17, 35],
        popupAnchor: [0, -30],
      })
      setFlagIcon(icon)
    })
  }, [])

  // Distance formula
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Find nearby turf
  const handleFindNearbyTurf = async () => {

    if (!selectedSport) {
      setErrorMessage("Please select sport first")
      return
    }

    setLoading(true)
    setErrorMessage("")
    setNearbyTurfs([])
    setSelectedCoords(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {

        const userLat = position.coords.latitude
        const userLon = position.coords.longitude

        const response = await fetch("/turfs.csv")
        const csvText = await response.text()
        const rows = csvText.split("\n").slice(1)

        const turfs = rows
          .map((row) => {
            const cols = row.split(",")
            if (cols.length < 4) return null

            const turfName = cols[0]?.trim()
            const gamesAvailable = cols[1]?.trim()
            const latitude = parseFloat(cols[2])
            const longitude = parseFloat(cols[3])

            if (!turfName || isNaN(latitude) || isNaN(longitude))
              return null

            const distance = calculateDistance(
              userLat,
              userLon,
              latitude,
              longitude
            )

            return { turfName, gamesAvailable, latitude, longitude, distance }
          })
          .filter(Boolean)

        const filtered = turfs
          .filter((t: any) =>
            t.gamesAvailable
              ?.toLowerCase()
              .includes(selectedSport.toLowerCase())
          )
          .sort((a: any, b: any) => a.distance - b.distance)

        if (filtered.length === 0) {
          setErrorMessage("No nearby turfs found.")
        }

        setNearbyTurfs(filtered)
        setLoading(false)
      },
      () => {
        setErrorMessage("Location permission denied.")
        setLoading(false)
      }
    )
  }

  // Submit
  const handleSubmit = async () => {

    if (!fullName || !email || !whatsapp || !selectedSport || !selectedTurf) {
      setErrorMessage("Please fill all required fields.")
      return
    }

    if (registerType === "Team" && !yourName) {
      setErrorMessage("Please enter your name.")
      return
    }

    if (selectedSport === "Cricket" && !playerType) {
      setErrorMessage("Please select player type.")
      return
    }

   const { error } = await supabase
  .from("registrations")
  .insert([
    {
      register_type: registerType,
      your_name: registerType === "Team" ? yourName : null,
      full_name: fullName,
      email,
      whatsapp_number: whatsapp,
      sport: selectedSport,
      player_type: selectedSport === "Cricket" ? playerType : null,
      turf_name: selectedTurf,
    },
  ])

if (error) {
  setErrorMessage("Error saving registration.")
  return
}

// 🔔 SEND EMAIL AFTER SUCCESSFUL INSERT
await fetch("/api/send-registration-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          register_type: registerType,
          your_name: registerType === "Team" ? yourName : null,
          full_name: fullName,
          email,
          whatsapp_number: whatsapp,
          sport: selectedSport,
          player_type: selectedSport === "Cricket" ? playerType : null,
          turf_name: selectedTurf,
        }),
      })

setSuccess(true)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-2xl font-bold text-center mb-6">
          Match Registration
        </h1>

        {success ? (
          <div className="text-green-600 text-center font-semibold">
            ✅ Your registration has been successfully completed. We’ll reach out to you soon.
          </div>
        ) : (
          <div className="space-y-5">

            {/* REGISTER AS */}
            <select
              value={registerType}
              onChange={(e) => setRegisterType(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option>Individual</option>
              <option>Team</option>
            </select>

            {/* Extra field only for Team */}
            {registerType === "Team" && (
              <input
                type="text"
                placeholder="Team Name"
                value={yourName}
                onChange={(e) => setYourName(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              />
            )}

            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            />

            <input
              type="email"
              placeholder="Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            />

            <input
              type="tel"
              placeholder="WhatsApp Number"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            />

            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">Select Sport</option>
              <option>Cricket</option>
              <option>Football</option>
              <option>Pickleball</option>
              <option>Swimming</option>
              <option>Volleyball</option>
              <option>Basketball</option>
              <option>Badminton</option>
            </select>

            {selectedSport === "Cricket" && (
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
            )}

            <button
              onClick={handleFindNearbyTurf}
              className="w-full bg-gray-800 text-white py-2 rounded-lg"
            >
              {loading ? "Finding..." : "Find Nearby Turfs"}
            </button>

            {nearbyTurfs.length > 0 && (
              <>
                <div className="text-sm text-gray-500">
                  Turf Names are sorted from low distance to high distance.
                </div>

                <select
                  value={selectedTurf}
                  onChange={(e) => {
                    const turf = nearbyTurfs.find(
                      (t: any) => t.turfName === e.target.value
                    )
                    if (!turf) return
                    setSelectedTurf(turf.turfName)
                    setSelectedCoords([turf.latitude, turf.longitude])
                  }}
                  className="w-full border rounded-lg px-4 py-2"
                >
                  <option value="">Select Turf</option>
                  {nearbyTurfs.map((turf: any, index: number) => (
                    <option key={index} value={turf.turfName}>
                      {turf.turfName} ({turf.distance.toFixed(2)} km)
                    </option>
                  ))}
                </select>
              </>
            )}

            {selectedCoords && flagIcon && (
              <MapContainer
                key={selectedTurf}
                center={selectedCoords}
                zoom={15}
                style={{ height: "350px", width: "100%" }}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={selectedCoords} icon={flagIcon}>
                  <Popup>{selectedTurf}</Popup>
                </Marker>
              </MapContainer>
            )}

            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}

                    <div className="mb-4 flex justify-center">
                      <ReCAPTCHA
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                        onChange={(token) => setCaptchaToken(token)}
                      />
                    </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-black text-white py-3 rounded-lg"
            >
              Confirm Registration
            </button>

          </div>
        )}
      </div>
    </div>
  )
}