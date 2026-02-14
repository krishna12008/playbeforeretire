"use client"

import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase-client"
import { useState, useEffect } from "react"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()

  const [user, setUser] = useState<any>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    getUser()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const navItem = (label: string, path: string) => (
    <button
      onClick={() => router.push(path)}
      className={`px-3 py-1 rounded-md text-sm transition ${
        pathname === path
          ? "bg-white text-black"
          : "text-gray-300 hover:text-white"
      }`}
    >
      {label}
    </button>
  )

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black shadow-md">
      <div className="flex justify-between items-center px-8 py-4">

        {/* Left Section */}
        <div className="flex items-center gap-8">
          <h1
            onClick={() => router.push("/")}
            className="font-bold text-xl text-white cursor-pointer tracking-wide"
          >
            Play Before Retire
          </h1>

          <nav className="hidden md:flex gap-4">
            {navItem("Home", "/")}
            {navItem("Sports", "/sports")}
            {navItem("Register Turf", "/register-turf")}
          </nav>

        </div>

        {/* Right Section */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 bg-white text-black px-3 py-1 rounded-full text-sm font-medium"
            >
              {user.email?.charAt(0).toUpperCase()}
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2">
                <div className="px-4 py-2 text-sm text-gray-600 border-b">
                  {user.email}
                </div>

                <button
                  onClick={() => router.push("/dashboard")}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Dashboard
                </button>

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/login")}
              className="text-white hover:underline"
            >
              Login
            </button>

            <button
              onClick={() => router.push("/signup")}
              className="bg-white text-black px-4 py-1 rounded-lg"
            >
              Signup
            </button>
          </div>
        )}

      </div>
    </header>
  )
}
