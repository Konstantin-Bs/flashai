import Link from "next/link"

export function Footer() {
    return (
        <div>
            <Link href="/impressum" className="text-black underline">
                Impressum
            </Link>
            <Link href="/datenschutzerklaerung" className="text-black underline">
                Datenschutzerklärung
            </Link>
        </div>
    )
}