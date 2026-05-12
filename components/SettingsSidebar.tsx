"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { RectangleEllipsis, Download } from "lucide-react"

export default function SettingsSidebar() {

    const pathname = usePathname()

    const links = [
        { href: "/settings/change-password", label: "Change Password" },
        { href: "/settings/export-data", label: "Export Data" },
    ]

    return (
        <div className="flex flex-col w-60 gap-1">
            {links.map(link => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-md text-left dark:text-white/70 text-sm p-1 border border-transparent ${
                        pathname === link.href 
                            ? "bg-gray-200 dark:bg-slate-900 hover:bg-gray-300 dark:hover:bg-slate-800" 
                            : "hover:bg-gray-300 dark:hover:bg-slate-800"
                    }`}
                >
                    {link.label}
                </Link>
            ))}
        </div>
    )
}