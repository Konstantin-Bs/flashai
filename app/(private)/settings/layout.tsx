import SettingsSidebar from "@/components/SettingsSidebar"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen max-w-6xl mx-auto gap-8 py-5">
      <SettingsSidebar />
      <div className="flex-1 px-30">{children}</div>
    </div>
  )
}
