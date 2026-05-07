import Link from "next/link"

export function Footer() {
    return (
        <div className="bg-white/50 dark:bg-slate-900 w-full py-4 px-6 flex items-center justify-center gap-12 mt-auto">
            <Link href="/impressum" className="dark:text-white/30 hover:underline hover:text-blue-600/73">
                Impressum
            </Link>
            <Link href="/datenschutzerklaerung" className="dark:text-white/30 hover:underline hover:text-blue-600/73">
                Datenschutzerklärung
            </Link>
        </div>
    )
}