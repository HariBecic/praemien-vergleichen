export interface RatgeberArticle {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  readingTime: string;
  lastUpdated: string;
  heroSubtitle: string;
  sections: {
    heading: string;
    content: string; // Can include simple HTML-safe text
    tip?: string;
  }[];
  faqItems: { q: string; a: string }[];
}

export const RATGEBER_ARTICLES: RatgeberArticle[] = [
  {
    slug: "krankenkasse-wechseln",
    title: "Krankenkasse wechseln 2026 – Anleitung, Fristen & Tipps",
    metaTitle: "Krankenkasse wechseln 2026 – Anleitung, Fristen & Tipps",
    metaDescription:
      "Krankenkasse wechseln leicht gemacht. Kündigungsfrist 30. November, Schritt-für-Schritt-Anleitung, Musterkündigung und wichtige Tipps für den Wechsel 2026.",
    keywords: [
      "Krankenkasse wechseln",
      "Krankenkasse wechseln Frist",
      "Krankenkasse kündigen",
      "Kündigungsfrist Krankenkasse",
      "Krankenkasse wechseln 2026",
      "Krankenkasse Schweiz wechseln",
    ],
    readingTime: "5 Min.",
    lastUpdated: "2026-01-15",
    heroSubtitle: "So wechseln Sie die Krankenkasse richtig – Fristen, Ablauf und Musterkündigung",
    sections: [
      {
        heading: "Warum lohnt sich ein Krankenkassenwechsel?",
        content:
          "Die Leistungen der Grundversicherung (KVG) sind bei allen Krankenkassen identisch – sie sind gesetzlich vorgeschrieben. Der einzige Unterschied ist der Preis. Zwischen der günstigsten und teuersten Kasse liegen oft CHF 200–400 pro Monat. Ein Wechsel bringt also die gleichen Leistungen zu einem tieferen Preis. Im Schweizer Durchschnitt steigen die Prämien 2026 um 4.4%. Wer nicht vergleicht, bezahlt sehr wahrscheinlich zu viel.",
      },
      {
        heading: "Wann kann ich die Krankenkasse wechseln?",
        content:
          "Die Grundversicherung kann auf zwei Termine gewechselt werden: per 1. Januar (ordentlicher Termin) und per 1. Juli bei Kantonen mit Prämienerhöhung (nur bei Standardmodell mit tiefster Franchise). Die Kündigungsfrist beträgt jeweils einen Monat. Für den Wechsel per 1. Januar muss die Kündigung also spätestens am 30. November bei der aktuellen Kasse eintreffen.",
        tip: "Senden Sie die Kündigung als Einschreiben bis spätestens 15. November ab – so sind Sie auf der sicheren Seite und haben einen Beleg.",
      },
      {
        heading: "Schritt-für-Schritt: So wechseln Sie die Krankenkasse",
        content:
          "Schritt 1: Vergleichen Sie Ihre aktuelle Prämie mit anderen Anbietern über unseren kostenlosen Prämienrechner. Geben Sie PLZ, Alter und gewünschte Franchise ein.\n\nSchritt 2: Wählen Sie eine neue Krankenkasse. Achten Sie auf Prämie, Modell (Standard, Hausarzt, HMO, Telmed) und Kundenbewertungen.\n\nSchritt 3: Melden Sie sich bei der neuen Kasse an. Die neue Kasse muss Sie in der Grundversicherung aufnehmen – es gibt keinen Aufnahmevorbehalt.\n\nSchritt 4: Kündigen Sie bei Ihrer aktuellen Kasse per Einschreiben. Die Kündigung muss bis 30. November eingehen.\n\nSchritt 5: Warten Sie die Bestätigung ab. Ihre aktuelle Kasse bestätigt die Kündigung innert weniger Tage.",
      },
      {
        heading: "Sonderkündigungsrecht bei Prämienerhöhung",
        content:
          "Wenn Ihre Krankenkasse die Prämie erhöht, haben Sie ein Sonderkündigungsrecht. Die Kasse muss Sie bis Ende Oktober über die neuen Prämien informieren. Ab diesem Zeitpunkt haben Sie bis 30. November Zeit zu kündigen. Bei Prämienerhöhung per 1. Juli (Standardmodell, tiefste Franchise) gilt die Frist bis 30. Juni.",
      },
      {
        heading: "Musterkündigung Krankenkasse",
        content:
          "Eine Kündigung der Grundversicherung ist formlos möglich. Wichtig sind: Ihr Name und Adresse, Versicherungsnummer, die Angabe dass Sie die Grundversicherung (KVG) per 31. Dezember kündigen, sowie Datum und Unterschrift. Senden Sie das Schreiben als Einschreiben.",
      },
      {
        heading: "Häufige Fehler beim Krankenkassenwechsel",
        content:
          "Der häufigste Fehler ist, die Frist zu verpassen. Der 30. November ist nicht das Datum des Poststempels, sondern das Datum des Eintreffens bei der Kasse. Weitere Fehler: vergessen die Zusatzversicherung separat zu prüfen (diese hat andere Regeln), oder den Wechsel verwechseln mit einem Modellwechsel innerhalb der gleichen Kasse.",
        tip: "Grundversicherung und Zusatzversicherung sind getrennt. Sie können die Grundversicherung bei Kasse A haben und die Zusatzversicherung bei Kasse B.",
      },
    ],
    faqItems: [
      {
        q: "Kann mich die neue Krankenkasse ablehnen?",
        a: "Nein. In der obligatorischen Grundversicherung (KVG) besteht Aufnahmepflicht. Jede Krankenkasse muss Sie aufnehmen, unabhängig von Alter, Gesundheitszustand oder Vorerkrankungen.",
      },
      {
        q: "Verliere ich Leistungen beim Wechsel?",
        a: "Nein. Die Leistungen der Grundversicherung sind gesetzlich festgelegt und bei allen Kassen identisch. Sie wechseln nur den Preis und den Service.",
      },
      {
        q: "Muss ich einen Grund für den Wechsel angeben?",
        a: "Nein. Die Kündigung kann ohne Begründung erfolgen. Sie müssen nur fristgerecht kündigen.",
      },
      {
        q: "Was passiert mit meiner Zusatzversicherung?",
        a: "Die Zusatzversicherung ist unabhängig von der Grundversicherung. Sie können sie behalten, separat kündigen oder zusammen mit der neuen Grundversicherung bei einem neuen Anbieter abschliessen. Achtung: Bei der Zusatzversicherung gibt es keine Aufnahmepflicht.",
      },
    ],
  },
  {
    slug: "franchise-waehlen",
    title: "Franchise wählen 2026 – Welche Franchise passt zu mir?",
    metaTitle: "Franchise wählen 2026 – Welche passt zu mir? Vergleich & Spartipps",
    metaDescription:
      "Welche Franchise ist die richtige? Vergleich CHF 300 bis CHF 2'500. Berechnen Sie Ihr Sparpotenzial und finden Sie die optimale Franchise für 2026.",
    keywords: [
      "Franchise Krankenkasse",
      "Franchise wählen",
      "Franchise 300 oder 2500",
      "Franchise Krankenkasse Schweiz",
      "Franchise ändern",
      "Franchise wechseln",
    ],
    readingTime: "4 Min.",
    lastUpdated: "2026-01-15",
    heroSubtitle: "CHF 300 oder CHF 2'500? So finden Sie die optimale Franchise",
    sections: [
      {
        heading: "Was ist die Franchise?",
        content:
          "Die Franchise ist der Betrag, den Sie pro Kalenderjahr selbst bezahlen, bevor die Krankenkasse Kosten übernimmt. In der Schweiz können Erwachsene zwischen 6 Franchisestufen wählen: CHF 300, CHF 500, CHF 1'000, CHF 1'500, CHF 2'000 und CHF 2'500. Für Kinder (bis 18 Jahre) gelten tiefere Stufen von CHF 0 bis CHF 600. Je höher die Franchise, desto tiefer die monatliche Prämie – und umgekehrt.",
      },
      {
        heading: "Die Faustregel zur Franchise-Wahl",
        content:
          "Die goldene Regel: Wählen Sie die höchste Franchise (CHF 2'500), wenn Ihre jährlichen Gesundheitskosten regelmässig unter CHF 1'500–2'000 liegen. Wählen Sie die tiefste Franchise (CHF 300), wenn Sie regelmässig hohe Arzt- und Medikamentenkosten haben. Für die meisten gesunden Erwachsenen unter 40 lohnt sich die höchste Franchise.",
        tip: "Legen Sie die monatliche Prämienersparnis als Notgroschen zur Seite – so können Sie die höhere Franchise im Ernstfall jederzeit bezahlen.",
      },
      {
        heading: "Rechenbeispiel: CHF 300 vs. CHF 2'500",
        content:
          "Angenommen, die monatliche Prämie bei Franchise CHF 300 beträgt CHF 450, und bei CHF 2'500 nur CHF 310. Die jährliche Prämienersparnis beträgt CHF 1'680. Wenn Sie gesund bleiben (Kosten unter CHF 300), sparen Sie mit der hohen Franchise netto CHF 1'680. Selbst wenn Sie einmal krank werden und die volle Franchise von CHF 2'500 zahlen müssen, ist der Nachteil nur CHF 2'200 minus CHF 1'680 = CHF 520. Bei zwei gesunden Jahren haben Sie diesen Betrag längst wieder herein.",
      },
      {
        heading: "Franchise ändern – wann und wie?",
        content:
          "Sie können Ihre Franchise jedes Jahr per 1. Januar ändern. Eine Erhöhung der Franchise (z.B. von CHF 300 auf CHF 2'500) können Sie bis Ende Dezember mitteilen. Eine Senkung (z.B. von CHF 2'500 auf CHF 300) muss bis 30. November der Kasse mitgeteilt werden – gleichzeitig mit einer allfälligen Kündigung.",
      },
      {
        heading: "Franchise für Familien",
        content:
          "Für Kinder gibt es separate, tiefere Franchisestufen (CHF 0 bis CHF 600). Die Franchise CHF 0 bedeutet, dass die Kasse ab dem ersten Franken zahlt. Da Kinder-Prämien ohnehin deutlich tiefer sind, wählen die meisten Eltern für ihre Kinder die Franchise CHF 0 oder CHF 100.",
      },
    ],
    faqItems: [
      {
        q: "Wie oft kann ich die Franchise ändern?",
        a: "Sie können die Franchise jedes Jahr per 1. Januar ändern. Es gibt keine Mindestlaufzeit.",
      },
      {
        q: "Welche Franchise empfehlen Experten?",
        a: "Für gesunde Erwachsene unter 40 mit wenig Arztbesuchen empfehlen die meisten Experten die höchste Franchise von CHF 2'500. Für Personen mit chronischen Erkrankungen oder regelmässigen Arztbesuchen ist CHF 300 sinnvoller.",
      },
      {
        q: "Gilt die Franchise auch für Notfälle?",
        a: "Ja. Die Franchise gilt für alle Leistungen der Grundversicherung, einschliesslich Notfälle, Spitalaufenthalte und Medikamente.",
      },
    ],
  },
  {
    slug: "versicherungsmodelle",
    title: "Hausarztmodell, HMO oder Telmed – Welches Modell spart am meisten?",
    metaTitle: "Hausarztmodell vs HMO vs Telmed 2026 – Vergleich & Spartipps",
    metaDescription:
      "Hausarztmodell, HMO oder Telmed? Vergleichen Sie die Versicherungsmodelle 2026. Bis zu 25% Prämienrabatt. Vor- und Nachteile im Überblick.",
    keywords: [
      "Hausarztmodell",
      "HMO Krankenkasse",
      "Telmed Modell",
      "Versicherungsmodell Krankenkasse",
      "Standard vs Hausarzt",
      "HMO vs Hausarzt",
    ],
    readingTime: "5 Min.",
    lastUpdated: "2026-01-15",
    heroSubtitle: "Standard, Hausarzt, HMO oder Telmed – das richtige Modell finden",
    sections: [
      {
        heading: "Die vier Versicherungsmodelle im Überblick",
        content:
          "In der Schweizer Grundversicherung gibt es vier Modelle: das Standardmodell (freie Arztwahl), das Hausarztmodell (Hausarzt als erste Anlaufstelle), das HMO-Modell (Behandlung im HMO-Zentrum) und das Telmed-Modell (telefonische Beratung vor dem Arztbesuch). Die Leistungen sind bei allen Modellen identisch – der Unterschied liegt im Zugang und im Preis.",
      },
      {
        heading: "Standardmodell – Freie Arztwahl",
        content:
          "Beim Standardmodell können Sie jeden Arzt und jedes Spital frei wählen, ohne vorherige Genehmigung. Dafür zahlen Sie die höchste Prämie. Dieses Modell eignet sich für Personen, die viel Wert auf freie Arztwahl legen oder häufig Spezialisten aufsuchen.",
      },
      {
        heading: "Hausarztmodell – 10-20% günstiger",
        content:
          "Beim Hausarztmodell wählen Sie einen festen Hausarzt als erste Anlaufstelle. Bei gesundheitlichen Problemen gehen Sie zuerst zum Hausarzt, der Sie bei Bedarf an einen Spezialisten überweist. Dafür erhalten Sie einen Prämienrabatt von typischerweise 10-20%. Notfälle sind von der Hausarzt-Pflicht ausgenommen.",
        tip: "Das Hausarztmodell ist der beste Kompromiss zwischen Ersparnis und Flexibilität – Sie haben einen festen Ansprechpartner und sparen trotzdem deutlich.",
      },
      {
        heading: "HMO-Modell – 15-25% günstiger",
        content:
          "Beim HMO-Modell (Health Maintenance Organization) gehen Sie bei gesundheitlichen Problemen in ein HMO-Zentrum. Dort arbeiten verschiedene Ärzte unter einem Dach zusammen. Der Prämienrabatt ist mit 15-25% am grössten. HMO-Zentren gibt es vor allem in grösseren Städten.",
        tip: "Prüfen Sie vor der Anmeldung, ob ein HMO-Zentrum in Ihrer Nähe existiert. In ländlichen Gebieten ist das Angebot oft eingeschränkt.",
      },
      {
        heading: "Telmed-Modell – 10-20% günstiger",
        content:
          "Beim Telmed-Modell rufen Sie bei gesundheitlichen Problemen zuerst eine medizinische Hotline an. Dort beraten Sie Fachpersonen und entscheiden, ob ein Arztbesuch nötig ist. Der Prämienrabatt liegt bei 10-20%. Dieses Modell eignet sich für Personen, die digital-affin sind und selten zum Arzt gehen.",
      },
      {
        heading: "Welches Modell passt zu mir?",
        content:
          "Für gesunde, junge Erwachsene die selten zum Arzt gehen: HMO oder Telmed (maximale Ersparnis). Für Personen mit regelmässigen Arztbesuchen: Hausarztmodell (guter Kompromiss). Für Personen, die maximale Flexibilität wollen: Standardmodell. Für Familien: Hausarztmodell (Kinder profitieren von einer festen Ansprechperson).",
      },
    ],
    faqItems: [
      {
        q: "Kann ich das Modell jederzeit wechseln?",
        a: "Sie können das Versicherungsmodell jeweils per 1. Januar wechseln. Die Mitteilung muss bis 30. November bei der Kasse eintreffen.",
      },
      {
        q: "Was passiert im Notfall?",
        a: "Bei allen Modellen gilt: Im Notfall können Sie direkt ins Spital oder zum nächsten Arzt gehen, ohne vorher den Hausarzt zu kontaktieren oder die Hotline anzurufen.",
      },
      {
        q: "Sind die Leistungen bei allen Modellen gleich?",
        a: "Ja. Die Leistungen der Grundversicherung sind gesetzlich festgelegt und bei allen Modellen identisch. Der Unterschied liegt nur im Zugangsweg und im Preis.",
      },
    ],
  },
  {
    slug: "praemienverbilligung",
    title: "Prämienverbilligung 2026 – Anspruch, Berechnung & Antrag",
    metaTitle: "Prämienverbilligung 2026 – Wer hat Anspruch? So beantragen Sie IPV",
    metaDescription:
      "Prämienverbilligung (IPV) 2026: Wer hat Anspruch? Einkommensgrenzen nach Kanton, Antragsverfahren und Fristen. Jetzt prüfen und Geld sparen.",
    keywords: [
      "Prämienverbilligung",
      "IPV",
      "Prämienverbilligung Anspruch",
      "Prämienverbilligung beantragen",
      "individuelle Prämienverbilligung",
      "Krankenkasse Zuschuss",
    ],
    readingTime: "4 Min.",
    lastUpdated: "2026-01-15",
    heroSubtitle: "Anspruch prüfen, Antrag stellen und von der Prämienverbilligung profitieren",
    sections: [
      {
        heading: "Was ist die Prämienverbilligung (IPV)?",
        content:
          "Die individuelle Prämienverbilligung (IPV) ist ein staatlicher Zuschuss zu den Krankenkassenprämien. Sie wird an Personen mit bescheidenem Einkommen ausgerichtet. Die Prämienverbilligung ist in der Schweiz kantonal geregelt – jeder Kanton hat eigene Einkommensgrenzen und Verfahren.",
      },
      {
        heading: "Wer hat Anspruch?",
        content:
          "Grundsätzlich haben Personen und Familien in bescheidenen wirtschaftlichen Verhältnissen Anspruch auf Prämienverbilligung. Die genauen Einkommensgrenzen variieren je nach Kanton stark. Als Faustregel: Einzelpersonen mit einem steuerbaren Einkommen unter ca. CHF 40'000–55'000 und Familien unter ca. CHF 60'000–90'000 können Anspruch haben. Studierende, Lehrlinge und Rentner haben oft spezielle Regelungen.",
      },
      {
        heading: "Wie beantrage ich die Prämienverbilligung?",
        content:
          "Das Verfahren ist je nach Kanton unterschiedlich. In einigen Kantonen (z.B. Bern, Aargau) wird die Berechtigung automatisch anhand der Steuerdaten geprüft – Sie erhalten automatisch einen Bescheid. In anderen Kantonen (z.B. Zürich) müssen Sie den Antrag selbst stellen. Kontaktieren Sie Ihre kantonale Ausgleichskasse oder das Sozialamt Ihrer Gemeinde für die genauen Schritte.",
        tip: "Auch wenn Sie knapp über der Einkommensgrenze liegen, lohnt es sich nachzufragen – viele Kantone berücksichtigen Kinder, hohe Mieten oder besondere Umstände.",
      },
      {
        heading: "Fristen beachten",
        content:
          "Viele Kantone haben Antragsfristen. Wer zu spät beantragt, verliert den Anspruch für das laufende Jahr. Prüfen Sie frühzeitig, ob Sie berechtigt sind – am besten gleich nach Erhalt der Steuerveranlagung oder des Prämienverbilligungs-Formulars.",
      },
    ],
    faqItems: [
      {
        q: "Muss ich die Prämienverbilligung jedes Jahr neu beantragen?",
        a: "In den meisten Kantonen ja. Die Berechtigung wird jährlich anhand des aktuellen steuerbaren Einkommens geprüft.",
      },
      {
        q: "Wird die Prämienverbilligung direkt an die Krankenkasse gezahlt?",
        a: "Ja, in den meisten Kantonen wird die IPV direkt an die Krankenkasse überwiesen und von Ihrer Prämie abgezogen.",
      },
      {
        q: "Kann ich die Prämienverbilligung und eine günstige Kasse kombinieren?",
        a: "Auf jeden Fall! Vergleichen Sie zuerst die Prämien und wechseln Sie zur günstigsten Kasse. Die Prämienverbilligung wird dann auf die bereits tiefere Prämie angerechnet – so sparen Sie doppelt.",
      },
    ],
  },
  {
    slug: "grundversicherung-leistungen",
    title: "Grundversicherung Schweiz 2026 – Leistungen im Überblick",
    metaTitle: "Grundversicherung Schweiz 2026 – Welche Leistungen sind gedeckt?",
    metaDescription:
      "Was deckt die obligatorische Grundversicherung (KVG) 2026? Alle Leistungen, Ausschlüsse und Kostenbeteiligung im Überblick.",
    keywords: [
      "Grundversicherung Leistungen",
      "KVG Leistungen",
      "Grundversicherung Schweiz",
      "obligatorische Krankenkasse",
      "Grundversicherung was ist gedeckt",
    ],
    readingTime: "5 Min.",
    lastUpdated: "2026-01-15",
    heroSubtitle: "Was die obligatorische Grundversicherung (KVG) abdeckt – und was nicht",
    sections: [
      {
        heading: "Was ist die Grundversicherung?",
        content:
          "Die obligatorische Krankenpflegeversicherung (OKP), umgangssprachlich Grundversicherung genannt, ist für alle in der Schweiz wohnhaften Personen Pflicht. Sie wird durch das Bundesgesetz über die Krankenversicherung (KVG) geregelt. Die Leistungen sind bei allen Krankenkassen identisch – der Unterschied liegt nur im Preis und im Service.",
      },
      {
        heading: "Gedeckte Leistungen",
        content:
          "Die Grundversicherung deckt folgende Leistungen: Arztbesuche (Allgemeinmedizin und Spezialisten), stationäre Spitalbehandlung in der allgemeinen Abteilung, Medikamente auf der Spezialitätenliste, Physiotherapie (auf ärztliche Verordnung), Laboruntersuchungen, Mutterschaft (Kontrolluntersuchungen, Geburt, Stillberatung), Notfallbehandlungen im Ausland (bis zum doppelten Schweizer Tarif), Zahnarzt bei Unfallfolgen oder schweren Erkrankungen, Psychotherapie (auf ärztliche Verordnung), sowie verschiedene Präventionsmassnahmen und Impfungen.",
      },
      {
        heading: "Nicht gedeckte Leistungen",
        content:
          "Folgende Leistungen sind NICHT in der Grundversicherung enthalten: Zahnärztliche Behandlungen (ausser bei Unfall oder schwerer Krankheit), Brillen und Kontaktlinsen (für Erwachsene), alternative Medizin (ausser die 5 anerkannten Methoden), halbprivate oder private Spitalabteilung, Fitness oder Wellness, ästhetische Eingriffe. Für diese Leistungen benötigen Sie eine Zusatzversicherung.",
      },
      {
        heading: "Kostenbeteiligung: Franchise, Selbstbehalt, Spitalbeitrag",
        content:
          "Neben der monatlichen Prämie tragen Versicherte drei Kosten: die Franchise (CHF 300–2'500 pro Jahr, frei wählbar), den Selbstbehalt (10% der Kosten über der Franchise, maximal CHF 700 pro Jahr für Erwachsene) und den Spitalkostenbeitrag (CHF 15 pro Spitaltag für Erwachsene). Die maximale jährliche Kostenbeteiligung beträgt somit CHF 3'200 (bei höchster Franchise) plus CHF 700 plus allfällige Spitaltage.",
      },
    ],
    faqItems: [
      {
        q: "Sind die Leistungen bei allen Kassen gleich?",
        a: "Ja. Die Leistungen der Grundversicherung sind gesetzlich festgelegt und bei allen zugelassenen Krankenkassen identisch.",
      },
      {
        q: "Brauche ich eine Zusatzversicherung?",
        a: "Das hängt von Ihren Bedürfnissen ab. Wenn Sie Wert auf freie Spitalwahl, Zahnversicherung, alternative Medizin oder Einzelzimmer legen, kann eine Zusatzversicherung sinnvoll sein.",
      },
      {
        q: "Deckt die Grundversicherung auch Auslandsaufenthalte?",
        a: "Ja, aber begrenzt. Notfallbehandlungen im Ausland werden bis zum doppelten Tarif übernommen, der in der Schweiz gelten würde. Für längere Auslandsaufenthalte empfiehlt sich eine Reiseversicherung.",
      },
    ],
  },
  {
    slug: "praemien-2026",
    title: "Krankenkassenprämien 2026 – Alle Änderungen im Überblick",
    metaTitle: "Krankenkassenprämien 2026 – Prämienerhöhung, Durchschnitt & Spartipps",
    metaDescription:
      "Krankenkassenprämien 2026: Durchschnittliche Erhöhung von 4.4%. Was sich ändert, welche Kantone am stärksten betroffen sind und wie Sie sparen.",
    keywords: [
      "Krankenkassenprämien 2026",
      "Prämienerhöhung 2026",
      "Krankenkasse 2026",
      "Prämien 2026 Schweiz",
      "Durchschnittsprämie 2026",
    ],
    readingTime: "4 Min.",
    lastUpdated: "2026-01-15",
    heroSubtitle: "Was sich 2026 ändert und wie Sie trotz Prämienerhöhung sparen",
    sections: [
      {
        heading: "Prämienentwicklung 2026",
        content:
          "Die durchschnittliche Krankenkassenprämie für Erwachsene in der Schweiz beträgt 2026 CHF 393.30 pro Monat. Das ist ein Anstieg von 4.4% gegenüber dem Vorjahr. Für eine vierköpfige Familie bedeutet das rund CHF 200 mehr pro Monat. Der Anstieg fällt je nach Kanton unterschiedlich aus – von 4.1% bis 5.2%.",
      },
      {
        heading: "Welche Kantone sind am stärksten betroffen?",
        content:
          "Die stärksten Prämienerhöhungen verzeichnen die Kantone Basel-Stadt (+4.8%), Genf (+4.7%), Waadt (+4.6%), Zürich (+5.2%) und Bern (+4.6%). Geringere Anstiege gibt es in den Kantonen Appenzell Innerrhoden (+4.1%), Nidwalden (+4.1%) und Thurgau (+4.1%). Generell steigen die Prämien in urbanen Kantonen stärker als in ländlichen.",
      },
      {
        heading: "Warum steigen die Prämien?",
        content:
          "Die Hauptgründe für den Prämienanstieg sind steigende Gesundheitskosten durch medizinischen Fortschritt und neue Behandlungsmethoden, die alternde Bevölkerung, höhere Medikamentenpreise und ein wachsendes Angebot an medizinischen Leistungen. Die COVID-19-Pandemie hat zudem zu Nachholeffekten bei aufgeschobenen Behandlungen geführt.",
      },
      {
        heading: "So sparen Sie trotz Prämienerhöhung",
        content:
          "Es gibt drei Hebel um trotz steigender Prämien Geld zu sparen: Krankenkasse wechseln (grösstes Sparpotenzial), Franchise erhöhen (spart CHF 100–200 pro Monat) und Versicherungsmodell wechseln (Hausarzt, HMO oder Telmed statt Standard spart 10-25%). Durch die Kombination aller drei Massnahmen können Erwachsene bis zu CHF 400 pro Monat sparen.",
        tip: "Vergleichen Sie jedes Jahr aufs Neue – auch wenn Sie letztes Jahr gewechselt haben. Die günstigste Kasse kann sich von Jahr zu Jahr ändern.",
      },
    ],
    faqItems: [
      {
        q: "Um wie viel steigen die Prämien 2026?",
        a: "Im Schweizer Durchschnitt steigen die Prämien um 4.4%. Je nach Kanton, Kasse und Modell kann der Anstieg zwischen 2% und 8% liegen.",
      },
      {
        q: "Was ist die Durchschnittsprämie 2026?",
        a: "Die durchschnittliche monatliche Prämie für Erwachsene beträgt 2026 CHF 393.30 (Franchise CHF 300, Standardmodell).",
      },
      {
        q: "Wie kann ich am einfachsten sparen?",
        a: "Der einfachste Weg: Prämien vergleichen und zur günstigsten Kasse wechseln. Das spart im Schnitt CHF 800–1'200 pro Jahr bei identischen Leistungen.",
      },
    ],
  },
];

// New articles for better topic authority
const ADDITIONAL_ARTICLES: RatgeberArticle[] = [
  {
    slug: "zusatzversicherung",
    title: "Zusatzversicherung Krankenkasse 2026 – Was lohnt sich wirklich?",
    metaTitle: "Zusatzversicherung Krankenkasse 2026 – Vergleich, Kosten & Tipps",
    metaDescription:
      "Zusatzversicherung Krankenkasse: Was ist sinnvoll? Spital-, Zahn- und Komplementärmedizin-Versicherung im Vergleich. Kosten, Leistungen und Tipps 2026.",
    keywords: [
      "Zusatzversicherung Krankenkasse",
      "Zusatzversicherung Schweiz",
      "Krankenkasse Zusatzversicherung",
      "Spitalzusatzversicherung",
      "Zahnzusatzversicherung",
      "Komplementärmedizin Versicherung",
    ],
    readingTime: "6 Min.",
    lastUpdated: "2026-01-15",
    heroSubtitle: "Welche Zusatzversicherungen sind sinnvoll und welche überflüssig?",
    sections: [
      {
        heading: "Was ist eine Zusatzversicherung?",
        content:
          "Im Gegensatz zur obligatorischen Grundversicherung (KVG) sind Zusatzversicherungen freiwillig. Sie decken Leistungen ab, die nicht in der Grundversicherung enthalten sind – zum Beispiel Zahnbehandlungen, alternative Medizin, Einzelzimmer im Spital oder freie Spitalwahl in der ganzen Schweiz. Zusatzversicherungen unterliegen dem Versicherungsvertragsgesetz (VVG), nicht dem KVG. Das bedeutet: Im Gegensatz zur Grundversicherung können Krankenkassen bei Zusatzversicherungen Gesundheitsfragen stellen und Anträge ablehnen.",
      },
      {
        heading: "Die wichtigsten Zusatzversicherungen im Überblick",
        content:
          "Die gängigsten Zusatzversicherungen sind: Spitalzusatzversicherung (halbprivat/privat für Einzelzimmer und freie Arztwahl), Zahnversicherung (für Zahnbehandlungen, Dentalhygiene, Kieferorthopädie), Komplementärmedizin (für Akupunktur, Homöopathie, Naturheilkunde), ambulante Zusatzversicherung (für Brillen, Fitness, Auslandsschutz) und Spitalkostenversicherung (für Spitalaufenthalte ausserhalb des Wohnkantons).",
      },
      {
        heading: "Spitalzusatzversicherung – Halbprivat oder Privat?",
        content:
          "Die Spitalzusatzversicherung ist die teuerste, aber auch eine der beliebtesten Zusatzversicherungen. Sie bietet: freie Spitalwahl in der ganzen Schweiz (auch Privatspitäler), Behandlung durch den Chefarzt, Einzel- oder Zweibettzimmer und oft bessere Verpflegung und Komfort. Die Kosten liegen je nach Alter und Versicherer zwischen CHF 50 und CHF 500 pro Monat. Für junge, gesunde Personen ist eine Spitalzusatzversicherung oft nicht notwendig – die allgemeine Abteilung bietet ebenfalls eine qualitativ hochwertige Versorgung.",
        tip: "Schliessen Sie Spitalzusatzversicherungen möglichst jung ab – die Prämien steigen mit dem Alter stark an, und bei Vorerkrankungen drohen Ausschlüsse.",
      },
      {
        heading: "Zahnversicherung – Sinnvoll oder nicht?",
        content:
          "Zahnbehandlungen sind in der Grundversicherung nur bei Unfall oder schweren Erkrankungen gedeckt. Eine Zahnversicherung übernimmt: Dentalhygiene, Füllungen, Kronen und Brücken, Kieferorthopädie (Zahnspangen) und teilweise Implantate. Die Kosten liegen zwischen CHF 20 und CHF 80 pro Monat. Wichtig: Viele Zahnversicherungen haben Wartefristen (meist 12-24 Monate) und Leistungsobergrenzen (z.B. CHF 3'000 pro Jahr). Für Personen mit guter Zahngesundheit lohnt sich oft das Selbersparen mehr als eine Versicherung.",
      },
      {
        heading: "Komplementärmedizin-Versicherung",
        content:
          "Diese Zusatzversicherung deckt alternative Behandlungsmethoden wie Akupunktur, Homöopathie, Osteopathie, Traditionelle Chinesische Medizin (TCM) und Naturheilkunde. Die Kosten sind mit CHF 15-40 pro Monat moderat. Achtung: Die Grundversicherung deckt bereits 5 Methoden der Komplementärmedizin, wenn sie von einem Arzt mit entsprechender Zusatzausbildung durchgeführt werden. Prüfen Sie daher genau, welche zusätzlichen Leistungen Sie wirklich benötigen.",
      },
      {
        heading: "Zusatzversicherung für Familien und Kinder",
        content:
          "Für Kinder sind bestimmte Zusatzversicherungen besonders sinnvoll: Zahnversicherung für Kieferorthopädie (Zahnspangen können CHF 5'000-15'000 kosten), Brillenversicherung (Kinderbrillen werden oft benötigt) und Auslandsschutz für Ferienreisen. Da Kinder selten Vorerkrankungen haben, ist der Abschluss in jungen Jahren oft problemlos und günstig.",
        tip: "Schliessen Sie Zusatzversicherungen für Kinder am besten gleich nach der Geburt ab – dann gibt es keine Gesundheitsfragen und keine Ausschlüsse.",
      },
      {
        heading: "Kündigung und Wechsel bei Zusatzversicherungen",
        content:
          "Im Gegensatz zur Grundversicherung können Sie Zusatzversicherungen nicht so einfach wechseln. Die neue Versicherung kann Sie aufgrund von Vorerkrankungen ablehnen oder mit Ausschlüssen versehen. Die Kündigungsfrist beträgt meist 3 Monate zum Jahresende. Tipp: Kündigen Sie eine Zusatzversicherung erst, wenn Sie die schriftliche Aufnahmebestätigung der neuen Versicherung haben.",
      },
    ],
    faqItems: [
      {
        q: "Muss ich Zusatzversicherungen bei der gleichen Krankenkasse haben?",
        a: "Nein. Sie können Grundversicherung und Zusatzversicherungen bei verschiedenen Anbietern haben. Das kann Geld sparen, da nicht jede Kasse bei allen Produkten günstig ist.",
      },
      {
        q: "Kann mich die Krankenkasse bei Zusatzversicherungen ablehnen?",
        a: "Ja. Im Gegensatz zur Grundversicherung gibt es bei Zusatzversicherungen keine Aufnahmepflicht. Die Kasse kann Gesundheitsfragen stellen und den Antrag ablehnen oder mit Vorbehalten annehmen.",
      },
      {
        q: "Werden Zusatzversicherungen im Alter teurer?",
        a: "Ja, die meisten Zusatzversicherungen werden mit dem Alter teurer. Besonders Spitalzusatzversicherungen können im Alter sehr teuer werden. Einige Anbieter bieten Tarife mit Altersrückstellungen an, die im Alter stabiler bleiben.",
      },
      {
        q: "Welche Zusatzversicherung empfehlen Experten?",
        a: "Das hängt von Ihrer persönlichen Situation ab. Für die meisten Personen ist eine ambulante Zusatzversicherung mit Auslandsschutz sinnvoll. Zahnversicherungen lohnen sich vor allem für Familien mit Kindern. Spitalzusatzversicherungen sind oft erst ab mittlerem Alter relevant.",
      },
    ],
  },
  {
    slug: "krankenkasse-familie",
    title: "Krankenkasse für Familien 2026 – So sparen Sie als Familie",
    metaTitle: "Krankenkasse Familie 2026 – Tipps, Vergleich & Spartipps für Familien",
    metaDescription:
      "Krankenkasse für Familien: Kinder, Rabatte und Spartipps. So finden Sie die günstigste Familienversicherung 2026. Bis zu CHF 5'000 pro Jahr sparen!",
    keywords: [
      "Krankenkasse Familie",
      "Krankenkasse Kinder",
      "Familienversicherung Schweiz",
      "Kinderprämien Krankenkasse",
      "Krankenkasse Baby",
      "Familienrabatt Krankenkasse",
    ],
    readingTime: "5 Min.",
    lastUpdated: "2026-01-15",
    heroSubtitle: "Die besten Krankenkassen-Tipps für Familien mit Kindern",
    sections: [
      {
        heading: "Krankenkasse für Kinder – Das Wichtigste",
        content:
          "In der Schweiz muss jedes Kind innerhalb von 3 Monaten nach der Geburt bei einer Krankenkasse angemeldet werden. Die Wahl der Krankenkasse ist frei – Sie können für jedes Kind eine andere Kasse wählen. Kinderprämien sind deutlich günstiger als Erwachsenenprämien und liegen je nach Kanton zwischen CHF 80 und CHF 150 pro Monat. Die Leistungen der Grundversicherung sind für Kinder identisch mit denen für Erwachsene.",
      },
      {
        heading: "Familienrabatte nutzen",
        content:
          "Viele Krankenkassen bieten Familienrabatte an: Ab dem zweiten Kind erhalten Sie oft 10-15% Rabatt auf die Kinderprämien. Einige Kassen bieten Rabatte, wenn die ganze Familie bei ihnen versichert ist. Diese Rabatte können mehrere Hundert Franken pro Jahr ausmachen. Vergleichen Sie daher nicht nur die Einzelprämien, sondern rechnen Sie die Gesamtkosten für die ganze Familie.",
        tip: "Es kann sich lohnen, alle Familienmitglieder bei der gleichen Kasse zu versichern – aber prüfen Sie immer, ob der Familienrabatt den Preisvorteil einer günstigeren Einzelkasse überwiegt.",
      },
      {
        heading: "Die richtige Franchise für Kinder",
        content:
          "Für Kinder gibt es spezielle Franchisestufen: CHF 0, CHF 100, CHF 200, CHF 300, CHF 400, CHF 500 und CHF 600. Da Kinder häufiger zum Arzt gehen als Erwachsene (Vorsorgeuntersuchungen, Impfungen, Kinderkrankheiten), empfehlen die meisten Experten für Kinder die Franchise CHF 0 oder CHF 100. Die Prämienersparnis bei höherer Franchise ist bei Kindern gering, das Risiko von Arztkosten aber hoch.",
      },
      {
        heading: "Versicherungsmodelle für Familien",
        content:
          "Für Familien eignet sich oft das Hausarztmodell: Die Kinder haben einen festen Kinderarzt als Ansprechpartner, und Sie sparen 10-20% Prämie. Das HMO-Modell ist für Familien weniger geeignet, da HMO-Zentren oft nicht auf Kinder spezialisiert sind. Das Telmed-Modell kann für ältere Kinder und Jugendliche eine Option sein.",
      },
      {
        heading: "Sparpotenzial für Familien",
        content:
          "Eine vierköpfige Familie (2 Erwachsene, 2 Kinder) kann durch den Wechsel zur günstigsten Krankenkasse mehrere Tausend Franken pro Jahr sparen. Rechenbeispiel: Wenn jedes Familienmitglied CHF 100 pro Monat spart, sind das CHF 4'800 pro Jahr. Dazu kommen mögliche Ersparnisse durch Familienrabatte, höhere Franchisen (bei den Eltern) und günstigere Modelle.",
        tip: "Vergleichen Sie die Krankenkassen jedes Jahr neu – die günstigste Kasse kann sich von Jahr zu Jahr ändern.",
      },
      {
        heading: "Prämienverbilligung für Familien",
        content:
          "Familien mit bescheidenem Einkommen haben Anspruch auf Prämienverbilligung (IPV). Kinder und junge Erwachsene in Ausbildung erhalten in vielen Kantonen automatisch eine volle oder teilweise Prämienverbilligung. Die genauen Einkommensgrenzen variieren je nach Kanton und Familiengrösse. Informieren Sie sich bei Ihrer kantonalen Ausgleichskasse.",
      },
    ],
    faqItems: [
      {
        q: "Müssen Kinder bei der gleichen Krankenkasse versichert sein wie die Eltern?",
        a: "Nein. Sie können jedes Familienmitglied bei einer anderen Krankenkasse versichern. Es kann sich aber lohnen, alle bei der gleichen Kasse zu haben, um von Familienrabatten zu profitieren.",
      },
      {
        q: "Bis wann muss ich mein Neugeborenes anmelden?",
        a: "Sie haben 3 Monate Zeit, Ihr Baby bei einer Krankenkasse anzumelden. Die Versicherung gilt dann rückwirkend ab Geburt. Melden Sie das Kind am besten schon vor der Geburt an.",
      },
      {
        q: "Welche Franchise empfehlen Experten für Kinder?",
        a: "Für Kinder empfehlen Experten meist die tiefste Franchise (CHF 0 oder CHF 100), da Kinder häufiger zum Arzt gehen und die Prämienersparnis bei höherer Franchise gering ist.",
      },
      {
        q: "Gibt es Familienrabatte bei allen Krankenkassen?",
        a: "Nein, nicht alle Kassen bieten Familienrabatte. Vergleichen Sie die Angebote und rechnen Sie die Gesamtkosten für Ihre Familie aus.",
      },
    ],
  },
  {
    slug: "krankenkasse-neugeborene",
    title: "Krankenkasse für Neugeborene 2026 – Anmeldung, Fristen & Tipps",
    metaTitle: "Krankenkasse Neugeborene 2026 – Anmeldung vor Geburt, Fristen & Kosten",
    metaDescription:
      "Krankenkasse für Baby: Wann anmelden? Welche Kasse? Kosten und Fristen für Neugeborene 2026. Checkliste für werdende Eltern.",
    keywords: [
      "Krankenkasse Neugeborene",
      "Krankenkasse Baby",
      "Baby Krankenversicherung Schweiz",
      "Krankenkasse anmelden Geburt",
      "Neugeborenes versichern",
      "Baby Krankenkasse Frist",
    ],
    readingTime: "4 Min.",
    lastUpdated: "2026-01-15",
    heroSubtitle: "Alles Wichtige zur Krankenversicherung für Ihr Baby",
    sections: [
      {
        heading: "Wann muss ich mein Baby anmelden?",
        content:
          "In der Schweiz haben Sie 3 Monate Zeit, Ihr Neugeborenes bei einer Krankenkasse anzumelden. Die Versicherung gilt dann rückwirkend ab dem Geburtsdatum. Es empfiehlt sich jedoch, das Baby bereits vor der Geburt anzumelden – so haben Sie eine Sorge weniger und die Anmeldung ist bei der Geburt bereits erledigt. Die meisten Krankenkassen ermöglichen eine vorgeburtliche Anmeldung ab dem 7. Schwangerschaftsmonat.",
      },
      {
        heading: "Welche Krankenkasse für mein Baby?",
        content:
          "Sie können Ihr Baby bei jeder zugelassenen Krankenkasse in der Schweiz anmelden – unabhängig davon, wo Sie selbst versichert sind. Vergleichen Sie die Prämien für Ihr Wohngebiet, da diese je nach Kasse stark variieren können. Die Leistungen der Grundversicherung sind überall identisch. Achten Sie auch auf mögliche Familienrabatte: Wenn Sie mehrere Kinder oder die ganze Familie bei der gleichen Kasse versichern, gibt es oft Vergünstigungen.",
        tip: "Viele Eltern versichern das Baby bei der gleichen Kasse wie sich selbst – das erleichtert die Administration und bringt oft Rabatte.",
      },
      {
        heading: "Kosten: Was kostet die Krankenkasse für ein Baby?",
        content:
          "Kinderprämien sind deutlich günstiger als Erwachsenenprämien. Je nach Kanton und Krankenkasse liegen die monatlichen Prämien für ein Baby zwischen CHF 80 und CHF 150. Die Franchise für Kinder kann zwischen CHF 0 und CHF 600 gewählt werden. Für Babys und Kleinkinder empfiehlt sich die tiefste Franchise (CHF 0), da regelmässige Vorsorgeuntersuchungen und Impfungen anfallen.",
      },
      {
        heading: "Vorgeburtliche Anmeldung – So geht's",
        content:
          "Bei der vorgeburtlichen Anmeldung geben Sie den voraussichtlichen Geburtstermin an. Nach der Geburt müssen Sie nur noch das tatsächliche Geburtsdatum und den Namen des Kindes mitteilen. Die meisten Krankenkassen bieten Online-Formulare für die vorgeburtliche Anmeldung an. Benötigte Angaben: Namen und Adresse der Eltern, voraussichtlicher Geburtstermin, gewünschte Franchise und Versicherungsmodell.",
      },
      {
        heading: "Zusatzversicherungen für Babys",
        content:
          "Für Babys sind bestimmte Zusatzversicherungen besonders empfehlenswert: Zahnversicherung (für spätere Kieferorthopädie), Komplementärmedizin (falls Sie alternative Behandlungsmethoden wünschen) und Auslandsschutz (für Reisen). Der grosse Vorteil: Bei Babys gibt es keine Gesundheitsfragen und keine Vorbehalte – das Kind wird ohne Einschränkungen aufgenommen. Später kann sich das ändern.",
        tip: "Schliessen Sie Zusatzversicherungen für Ihr Baby gleich nach der Geburt ab. Dann gibt es garantiert keine Ablehnungen oder Ausschlüsse.",
      },
      {
        heading: "Checkliste für werdende Eltern",
        content:
          "1. Ab dem 7. Monat: Krankenkassenprämien für Babys vergleichen\n2. Vor der Geburt: Baby vorgeburtlich bei gewählter Kasse anmelden\n3. Gewünschte Zusatzversicherungen abschliessen\n4. Nach der Geburt: Geburtsdatum und Namen der Kasse melden\n5. Prämienverbilligung prüfen (viele Kantone zahlen für Kinder automatisch)\n6. Unterlagen aufbewahren (Versicherungsausweis, Police)",
      },
    ],
    faqItems: [
      {
        q: "Was passiert, wenn ich die 3-Monats-Frist verpasse?",
        a: "Wenn Sie die Frist verpassen, beginnt die Versicherung erst ab dem Anmeldedatum – nicht rückwirkend ab Geburt. Medizinische Kosten zwischen Geburt und Anmeldung müssten Sie selbst tragen. Melden Sie Ihr Baby daher unbedingt rechtzeitig an.",
      },
      {
        q: "Kann ich mein Baby schon vor der Geburt anmelden?",
        a: "Ja, die meisten Krankenkassen ermöglichen eine vorgeburtliche Anmeldung ab dem 7. Schwangerschaftsmonat. Das ist sehr empfehlenswert.",
      },
      {
        q: "Muss mein Baby bei der gleichen Krankenkasse sein wie ich?",
        a: "Nein. Sie können Ihr Baby bei jeder beliebigen Krankenkasse versichern. Es kann aber praktisch sein und Rabatte bringen, die ganze Familie bei einer Kasse zu haben.",
      },
      {
        q: "Welche Franchise soll ich für mein Baby wählen?",
        a: "Für Babys und Kleinkinder empfiehlt sich die Franchise CHF 0 oder CHF 100. Kinder gehen häufiger zum Arzt, und die Prämienersparnis bei höherer Franchise ist minimal.",
      },
    ],
  },
  {
    slug: "krankenkasse-schweiz-vergleich",
    title: "Krankenkassen Schweiz 2026 – Alle 27 Versicherer im Vergleich",
    metaTitle: "Krankenkassen Schweiz 2026 – Liste aller Versicherer & Vergleich",
    metaDescription:
      "Alle Krankenkassen der Schweiz 2026 im Überblick: Liste der 27 zugelassenen Versicherer, Prämienvergleich und Tipps zur Wahl der besten Krankenkasse.",
    keywords: [
      "Krankenkassen Schweiz",
      "Krankenkassen Liste Schweiz",
      "alle Krankenkassen Schweiz",
      "Krankenkassen Vergleich Schweiz",
      "Schweizer Krankenkassen",
      "beste Krankenkasse Schweiz",
      "günstigste Krankenkasse Schweiz",
    ],
    readingTime: "6 Min.",
    lastUpdated: "2026-01-15",
    heroSubtitle: "Übersicht aller Schweizer Krankenkassen mit Prämienvergleich",
    sections: [
      {
        heading: "Wie viele Krankenkassen gibt es in der Schweiz?",
        content:
          "In der Schweiz gibt es 2026 insgesamt 27 zugelassene Krankenkassen, die die obligatorische Grundversicherung (KVG) anbieten. Diese Zahl ist in den letzten Jahren durch Fusionen gesunken – vor 20 Jahren waren es noch über 100 Kassen. Die grössten Versicherer sind CSS, Helsana, Swica und Groupe Mutuel. Alle 27 Kassen bieten identische Leistungen in der Grundversicherung – der Unterschied liegt nur im Preis und im Service.",
      },
      {
        heading: "Liste aller Krankenkassen in der Schweiz 2026",
        content:
          "Die 27 zugelassenen Krankenkassen sind: Aquilana, Assura, Atupri, Avenir, CSS, EGK, Groupe Mutuel, Helsana, Innova, Intras, KluG, KPT, Luzerner Hinterland, Moove Sympany, OKK, Philos, Progrès, PROVITA, Rhenusana, SANA24, Sanitas, Steffisburg, Sumiswalder, SWICA, Sympany, Visana und Vita Surselva. Einige dieser Kassen sind nur regional tätig, andere sind schweizweit aktiv.",
      },
      {
        heading: "Die grössten Krankenkassen der Schweiz",
        content:
          "Die vier grössten Krankenkassen nach Versichertenzahl sind: CSS (ca. 1.8 Mio. Versicherte), Helsana (ca. 1.5 Mio.), SWICA (ca. 1.5 Mio.) und Groupe Mutuel (ca. 1.3 Mio.). Diese vier Kassen zusammen versichern über die Hälfte der Schweizer Bevölkerung. Grösse bedeutet aber nicht automatisch tiefste Prämien – oft sind kleinere, regionale Kassen günstiger.",
      },
      {
        heading: "Welche Krankenkasse ist die günstigste?",
        content:
          "Die günstigste Krankenkasse hängt von Ihrem Wohnort (Kanton und Prämienregion), Ihrem Alter und dem gewählten Versicherungsmodell ab. Es gibt keine Krankenkasse, die überall am günstigsten ist. In vielen Regionen gehören Assura, Groupe Mutuel und CSS zu den günstigeren Anbietern. Nutzen Sie unseren kostenlosen Prämienrechner, um die günstigste Kasse für Ihre persönliche Situation zu finden.",
        tip: "Vergleichen Sie jedes Jahr neu – die Prämienunterschiede zwischen den Kassen können mehrere Hundert Franken pro Jahr betragen.",
      },
      {
        heading: "Qualität und Service der Krankenkassen",
        content:
          "Obwohl die Leistungen der Grundversicherung überall gleich sind, unterscheiden sich die Kassen im Service: Erreichbarkeit des Kundendienstes, Online-Services und App-Funktionalität, Schnelligkeit der Rechnungsabwicklung und Beratungsqualität. Unabhängige Umfragen (z.B. von K-Tipp, Comparis) bewerten regelmässig die Kundenzufriedenheit. Spitzenreiter sind oft SWICA, KPT, Sanitas und Atupri.",
      },
      {
        heading: "Regionale vs. nationale Krankenkassen",
        content:
          "Einige Krankenkassen sind nur in bestimmten Regionen oder Kantonen tätig, zum Beispiel Luzerner Hinterland (Luzern), Vita Surselva (Graubünden) oder Steffisburg (Bern). Diese regionalen Kassen sind oft günstiger als die grossen nationalen Anbieter. Der Nachteil: Bei einem Umzug in einen anderen Kanton müssen Sie möglicherweise die Kasse wechseln. Prüfen Sie daher, ob Ihre Wunschkasse auch in Ihrem Kanton tätig ist.",
      },
    ],
    faqItems: [
      {
        q: "Sind die Leistungen bei allen Krankenkassen gleich?",
        a: "Ja, in der Grundversicherung (KVG) sind die Leistungen gesetzlich festgelegt und bei allen 27 Kassen identisch. Unterschiede gibt es nur bei Zusatzversicherungen, die aber freiwillig sind.",
      },
      {
        q: "Welche Krankenkasse hat den besten Service?",
        a: "Laut unabhängigen Umfragen haben SWICA, KPT, Sanitas und Atupri regelmässig die höchste Kundenzufriedenheit. Aber: Service ist subjektiv, und eine günstigere Prämie kann wichtiger sein als perfekter Service.",
      },
      {
        q: "Kann jede Krankenkasse mich aufnehmen?",
        a: "Ja, in der Grundversicherung besteht Aufnahmepflicht. Keine Krankenkasse darf Sie ablehnen, unabhängig von Alter, Gesundheitszustand oder Vorerkrankungen. Bei Zusatzversicherungen ist das anders – dort können Kassen Anträge ablehnen.",
      },
      {
        q: "Wie oft kann ich die Krankenkasse wechseln?",
        a: "Sie können die Krankenkasse jedes Jahr per 1. Januar wechseln. Die Kündigung muss bis 30. November bei der alten Kasse eintreffen. Es gibt keine Mindestvertragsdauer.",
      },
    ],
  },
  {
    slug: "krankenkasse-expats",
    title: "Krankenkasse für Expats & Zuzüger 2026 – Anmeldung & Tipps",
    metaTitle: "Krankenkasse Expats Schweiz 2026 – Anmeldung, Fristen & Tipps für Zuzüger",
    metaDescription:
      "Krankenkasse für Expats und Zuzüger in die Schweiz: Anmeldepflicht, Fristen, Kosten und Tipps. Alles Wichtige zur Krankenversicherung beim Umzug in die Schweiz 2026.",
    keywords: [
      "Krankenkasse Expats Schweiz",
      "Krankenkasse Zuzug Schweiz",
      "Krankenversicherung Ausländer Schweiz",
      "Krankenkasse Einwanderung Schweiz",
      "Krankenkasse neu in der Schweiz",
      "Grenzgänger Krankenversicherung",
    ],
    readingTime: "5 Min.",
    lastUpdated: "2026-01-15",
    heroSubtitle: "Krankenversicherung beim Umzug in die Schweiz – Was Sie wissen müssen",
    sections: [
      {
        heading: "Versicherungspflicht in der Schweiz",
        content:
          "Wer in der Schweiz wohnt, muss sich innert 3 Monaten nach Wohnsitznahme bei einer Schweizer Krankenkasse für die Grundversicherung (KVG) anmelden. Dies gilt für alle Personen unabhängig von der Staatsangehörigkeit – also auch für EU-Bürger, Drittstaatenangehörige und Schweizer Rückkehrer. Die Versicherung gilt dann rückwirkend ab dem Tag der Einreise bzw. Wohnsitznahme. Melden Sie sich also rechtzeitig an, um Lücken zu vermeiden.",
      },
      {
        heading: "Anmeldung bei der Krankenkasse – So geht's",
        content:
          "Nach der Anmeldung bei der Gemeinde (Einwohnerkontrolle) können Sie sich bei einer beliebigen Schweizer Krankenkasse anmelden. Benötigte Unterlagen: Kopie des Ausweises/Passes, Aufenthaltsbewilligung (falls bereits vorhanden), Anmeldebestätigung der Gemeinde, bisherige Versicherungsnachweise (falls vorhanden). Die meisten Kassen ermöglichen eine Online-Anmeldung. Vergleichen Sie vorher die Prämien – die Unterschiede können erheblich sein.",
        tip: "Sie können die Krankenkasse frei wählen. Nutzen Sie einen Prämienvergleich, um die günstigste Kasse für Ihren Wohnort zu finden.",
      },
      {
        heading: "Aufnahmepflicht – Keine Gesundheitsprüfung",
        content:
          "In der Grundversicherung (KVG) besteht Aufnahmepflicht: Jede Krankenkasse muss Sie aufnehmen, unabhängig von Alter, Gesundheitszustand oder Vorerkrankungen. Es gibt keine Gesundheitsfragen und keine Wartezeiten. Das ist ein grosser Unterschied zu privaten Krankenversicherungen in anderen Ländern. Bei Zusatzversicherungen ist das allerdings anders – dort können Kassen Gesundheitsfragen stellen und Anträge ablehnen.",
      },
      {
        heading: "Kosten der Krankenversicherung in der Schweiz",
        content:
          "Die Prämien der Grundversicherung variieren je nach Wohnkanton, Alter und gewähltem Modell. Erwachsene zahlen 2026 im Durchschnitt etwa CHF 390 pro Monat (bei Franchise CHF 300). In Kantonen wie Genf, Basel oder Zürich sind die Prämien höher, in ländlichen Kantonen wie Appenzell oder Nidwalden günstiger. Durch Wahl einer höheren Franchise (bis CHF 2'500) oder eines alternativen Modells (Hausarzt, HMO, Telmed) können Sie deutlich sparen.",
      },
      {
        heading: "Besonderheiten für Grenzgänger",
        content:
          "Wenn Sie in einem EU/EFTA-Staat wohnen und in der Schweiz arbeiten (Grenzgänger), haben Sie ein Wahlrecht: Sie können sich entweder in der Schweiz oder in Ihrem Wohnsitzland versichern. In der Schweiz sind Sie dann dem KVG unterstellt mit allen Rechten und Pflichten. Viele Grenzgänger wählen die Schweizer Versicherung, weil die Leistungen besser sind. Informieren Sie sich bei Ihrer Gemeinde über die genauen Regelungen.",
      },
      {
        heading: "Private Krankenversicherung vs. KVG",
        content:
          "Anders als in einigen anderen Ländern ist es in der Schweiz nicht möglich, sich statt der Grundversicherung (KVG) privat zu versichern. Die Grundversicherung ist obligatorisch. Sie können aber zusätzlich zur Grundversicherung private Zusatzversicherungen abschliessen, z.B. für Zahnbehandlungen, Einzelzimmer im Spital oder alternative Medizin. Achtung: Bei Zusatzversicherungen gibt es Gesundheitsfragen – schliessen Sie diese möglichst bald nach der Einreise ab, wenn Sie noch gesund sind.",
        tip: "Schliessen Sie Zusatzversicherungen möglichst schnell nach der Einreise ab. Je jünger und gesünder Sie sind, desto einfacher ist die Aufnahme und desto günstiger die Prämie.",
      },
    ],
    faqItems: [
      {
        q: "Muss ich mich sofort bei einer Krankenkasse anmelden?",
        a: "Sie haben 3 Monate Zeit ab Wohnsitznahme. Die Versicherung gilt dann rückwirkend ab Einreisedatum. Es empfiehlt sich aber, sich schnell anzumelden, um medizinische Kosten abzudecken.",
      },
      {
        q: "Kann ich meine ausländische Krankenversicherung behalten?",
        a: "Nein, die Schweizer Grundversicherung (KVG) ist obligatorisch und kann nicht durch eine ausländische Versicherung ersetzt werden. Sie müssen sich bei einer Schweizer Kasse anmelden.",
      },
      {
        q: "Werden Vorerkrankungen berücksichtigt?",
        a: "Nein, in der Grundversicherung nicht. Jede Kasse muss Sie aufnehmen, unabhängig von Vorerkrankungen. Bei Zusatzversicherungen können Vorerkrankungen aber zu Ausschlüssen führen.",
      },
      {
        q: "Wie hoch ist die Selbstbeteiligung?",
        a: "Sie wählen eine Franchise zwischen CHF 300 und CHF 2'500 pro Jahr. Zusätzlich zahlen Sie 10% Selbstbehalt auf Kosten über der Franchise (max. CHF 700/Jahr) plus CHF 15 pro Spitaltag.",
      },
    ],
  },
];

// Combine all articles
export const ALL_RATGEBER_ARTICLES = [...RATGEBER_ARTICLES, ...ADDITIONAL_ARTICLES];

export function getRatgeberBySlug(slug: string): RatgeberArticle | undefined {
  return ALL_RATGEBER_ARTICLES.find((a) => a.slug === slug);
}

export function getAllRatgeberSlugs(): string[] {
  return ALL_RATGEBER_ARTICLES.map((a) => a.slug);
}
