"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { Settings, LogOut } from "lucide-react"

interface Props {
    onClose: () => void
}

export default function ProfilePanel({ onClose }: Props) {
    const { user, loading } = useAuth()
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
        
        onClose()
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
            <div className="absolute inset-0" />

            {/* panel */}
            <div
                ref={panelRef}
                className="absolute right-4 top-20 h-auto rounded-xl w-60 bg-white dark:bg-slate-950 border border-slate-950 dark:border-white/30 shadow-lg flex flex-col p-2 gap-2"
            >
                <p className="text-sm text-center break-all p-1">{user?.email}</p>

                <div className="border-t border-black dark:border-white/30"/>

                <button
                    onClick={() => alert("Settings coming soon")}
                    className="w-full text-left text-sm p-1 rounded-md border border-transparent hover:border-slate-950 dark:hover:border-white/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                    <Settings size={16}/>
                    Settings
                </button>

                <div className="border-t border-black dark:border-white/30"/>

                <div className="mt-auto flex flex-col gap-3">
                    <button
                        onClick={handleLogout}
                        className="w-full text-left rounded-md p-1 text-sm border border-transparent hover:border-gray-500 dark:hover:border-white/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                        <LogOut size={16}/>
                        Sign out
                    </button>
                    <button
                        onClick={handleDeleteAccount}
                        className="w-full text-sm p-1 rounded-md border border-red-500 text-red-500 hover:bg-gray-500 dark:hover:bg-slate-800 cursor-pointer"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    )
}