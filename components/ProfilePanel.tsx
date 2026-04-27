"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"

interface Props {
    onClose: () => void
}

export default function ProfilePanel({ onClose }: Props) {
    const { user } = useAuth()
    const router = useRouter()
    const panelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                onClose()
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [onClose])

    async function handleLogout() {
        await signOut()
        router.push("/login")
    }

    async function handleDeleteAccount() {
        const confirmed = window.confirm(
            "Are you sure? This will permanently delete your account and all your decks."
        )
        if (!confirmed) return

        const { error } = await supabase.rpc("delete_user")
        if (error) {
            alert("Something went wrong. Please try again.")
            return
        }

        router.push("/login")
    }

    return (
        <div className="fixed inset-0 z-50">
            {/* backdrop */}
            <div className="absolute inset-0 bg-black/20" />

            {/* panel */}
            <div
                ref={panelRef}
                className="absolute right-0 top-0 h-full w-72 bg-white shadow-lg flex flex-col p-6 gap-4"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-lg">Profile</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-black text-xl"
                    >
                        ✕
                    </button>
                </div>

                <p className="text-sm text-gray-500 break-all">{user?.email}</p>

                <hr />

                <button
                    onClick={() => alert("Settings coming soon")}
                    className="text-left text-sm font-medium hover:text-gray-600"
                >
                    Settings
                </button>

                <hr />

                <div className="mt-auto flex flex-col gap-3">
                    <button
                        onClick={handleLogout}
                        className="w-full border rounded p-2 text-sm font-medium hover:bg-gray-50"
                    >
                        Logout
                    </button>
                    <button
                        onClick={handleDeleteAccount}
                        className="w-full border border-red-300 text-red-500 rounded p-2 text-sm font-medium hover:bg-red-50"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    )
}