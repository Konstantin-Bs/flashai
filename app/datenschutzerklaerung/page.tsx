export default function Page() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Datenschutzerklärung</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Präambel</h2>
        <p className="mb-2">
          Mit der folgenden Datenschutzerklärung informieren wir Sie darüber,
          welche personenbezogenen Daten wir verarbeiten, zu welchen Zwecken
          dies geschieht und in welchem Umfang dies erfolgt. Diese
          Datenschutzerklärung gilt für unser gesamtes Onlineangebot.
        </p>
        <p className="text-sm dark:text-gray-400">Stand: 13. Mai 2026</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Verantwortlicher</h2>
        <p>
          Konstantin Booms
          <br />
          Walterstraße 9<br />
          47441 Moers, Deutschland
        </p>
        <p className="mt-2">E-Mail: konstantin.booms@gmail.com</p>
        <p className="mt-1">
          Impressum: https://getflashai.vercel.app/impressum
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          Übersicht der Verarbeitungen
        </h2>
        <p className="mb-2">
          Wir verarbeiten personenbezogene Daten insbesondere zu folgenden
          Zwecken:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Bereitstellung unseres Onlineangebots</li>
          <li>Erstellung und Verwaltung von Nutzerkonten</li>
          <li>Kommunikation mit Nutzern</li>
          <li>Sicherstellung der technischen Sicherheit</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Verarbeitete Datenarten</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Bestandsdaten (z. B. Name, E-Mail)</li>
          <li>Nutzungsdaten (z. B. Seitenaufrufe)</li>
          <li>Inhaltsdaten (z. B. eingegebene Inhalte)</li>
          <li>Meta-/Kommunikationsdaten (z. B. IP-Adresse)</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Rechtsgrundlagen</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</li>
          <li>Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)</li>
          <li>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung, falls erforderlich)</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Sicherheitsmaßnahmen</h2>
        <p>
          Wir treffen technische und organisatorische Maßnahmen, um Ihre Daten
          zu schützen. Dazu gehört insbesondere die verschlüsselte Übertragung
          (HTTPS).
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          Hosting und Infrastruktur
        </h2>
        <p className="mb-2">
          Unser Onlineangebot wird über folgende Dienste bereitgestellt:
        </p>
        <ul className="list-disc list-inside space-y-1 mb-3">
          <li>
            <strong>
              Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104,
              USA:
            </strong>{" "}
            Hosting und Bereitstellung der Website. Ein
            Auftragsverarbeitungsvertrag wurde auf Basis der
            EU-Standardvertragsklauseln abgeschlossen. Weitere Informationen:
            vercel.com/legal/dpa
          </li>
          <li>
            <strong>
              Supabase Inc., 970 Trestle Glen Rd, Oakland, CA 94610, USA:
            </strong>{" "}
            Datenbank, Authentifizierung und Backend-Services. Ein
            Auftragsverarbeitungsvertrag (AVV) wurde abgeschlossen.
            Datenspeicherung erfolgt in Frankfurt, Deutschland (EU).
          </li>
          <li>
            <strong>
              Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043,
              USA:
            </strong>{" "}
            Verarbeitung von Nutzereingaben zur Generierung von Inhalten (Google
            Gemini API) sowie Authentifizierung (Google Sign-In). Die Nutzung
            erfolgt auf Grundlage der Google Cloud Data Processing Terms, die
            automatisch mit der Nutzung des Dienstes gelten.
          </li>
        </ul>
        <p>
          Bei der Nutzung der Google AI API können eingegebene Inhalte (z. B.
          Texteingaben) an Server in den USA übermittelt und dort verarbeitet
          werden, um die angeforderten Funktionen bereitzustellen.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          Internationale Datentransfers
        </h2>
        <p>
          Bei der Nutzung von Diensten wie Vercel, Supabase oder Google kann es
          zur Übermittlung von Daten in Drittländer (z. B. USA) kommen. Die
          Übermittlung erfolgt auf Grundlage geeigneter Garantien wie
          Standardvertragsklauseln gemäß DSGVO.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Speicherung und Löschung</h2>
        <p className="mb-3">
          Wir speichern personenbezogene Daten nur so lange, wie dies für die
          jeweiligen Zwecke erforderlich ist. Die konkreten Speicherdauern sind
          wie folgt:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Kontodaten (E-Mail-Adresse):</strong> Bis zur Löschung des
            Nutzerkontos durch den Nutzer selbst oder auf Anfrage.
          </li>
          <li>
            <strong>Karteikarten und Decks:</strong> Werden unmittelbar und
            vollständig bei Löschung des Nutzerkontos gelöscht.
          </li>
          <li>
            <strong>Server-Logs (Vercel):</strong> Werden automatisch nach 30
            Tagen gelöscht.
          </li>
          <li>
            <strong>Authentifizierungsdaten (Supabase):</strong> Werden bei
            Kontolöschung sofort entfernt.
          </li>
        </ul>
        <p className="mt-3">
          Nutzer können ihr Konto und alle damit verbundenen Daten jederzeit
          direkt in den Einstellungen der App löschen.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          Rechte der betroffenen Personen
        </h2>
        <p className="mb-2">Sie haben folgende Rechte gemäß DSGVO:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Auskunft über Ihre gespeicherten Daten</li>
          <li>Berichtigung unrichtiger Daten</li>
          <li>Löschung Ihrer Daten</li>
          <li>Einschränkung der Verarbeitung</li>
          <li>Datenübertragbarkeit</li>
          <li>Widerspruch gegen die Verarbeitung</li>
          <li>Widerruf erteilter Einwilligungen</li>
          <li>
            Sie können Ihr Konto und alle damit verbundenen Daten jederzeit
            direkt in der App löschen.
          </li>
          <li>
            Datenübertragbarkeit — Sie können Ihre Daten jederzeit als
            JSON-Datei in den Einstellungen exportieren.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Nutzerkonto</h2>
        <p className="mb-2">
          Wenn Sie ein Nutzerkonto erstellen, verarbeiten wir Ihre Login-Daten
          (E-Mail, Passwort), um Ihnen den Zugang zu ermöglichen.
        </p>
        <p>
          Alternativ kann die Anmeldung über Google Sign-In (Google LLC)
          erfolgen.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Cookies</h2>
        <p>
          Wir verwenden ausschließlich technisch notwendige Cookies für die
          Authentifizierung und Sitzungsverwaltung. Diese Cookies sind für den
          Betrieb der Website erforderlich und bedürfen keiner Einwilligung.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Kontakt</h2>
        <p>
          Wenn Sie mit uns Kontakt aufnehmen, erfolgt dies ausschließlich per
          E-Mail. In diesem Fall verarbeiten wir die von Ihnen übermittelten
          Daten (z. B. E-Mail-Adresse und Inhalt der Nachricht), um Ihre Anfrage
          zu bearbeiten.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          Einsatz von Künstlicher Intelligenz
        </h2>
        <p className="mb-3">
          Unsere Anwendung nutzt Künstliche Intelligenz zur Generierung von
          Lernkarten. Hierfür werden die vom Nutzer eingegebenen Texte oder
          hochgeladenen Dateien an die Google Gemini API (Google LLC, 1600
          Amphitheatre Parkway, Mountain View, CA 94043, USA) übermittelt und
          dort verarbeitet.
        </p>
        <p className="mb-3">
          Die generierten Lernkarten werden ausschließlich durch KI erstellt.
          Nutzer werden darauf hingewiesen, dass KI-generierte Inhalte ungenau
          sein können und sollten die Ergebnisse eigenständig überprüfen.
        </p>
        <p>
          Rechtsgrundlage für diese Verarbeitung ist Art. 6 Abs. 1 lit. b DSGVO
          (Vertragserfüllung), da die KI-Generierung eine Kernfunktion des
          Dienstes darstellt.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Änderungen</h2>
        <p>
          Wir behalten uns vor, diese Datenschutzerklärung anzupassen. Die
          letzte Aktualisierung erfolgte am 13. Mai 2026.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Aufsichtsbehörde</h2>
        <p>
          Landesbeauftragte für Datenschutz und Informationsfreiheit
          Nordrhein-Westfalen
          <br />
          Postfach 20 04 44
          <br />
          40102 Düsseldorf
        </p>
      </section>
    </div>
  )
}
