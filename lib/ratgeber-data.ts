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

export function getRatgeberBySlug(slug: string): RatgeberArticle | undefined {
  return RATGEBER_ARTICLES.find((a) => a.slug === slug);
}

export function getAllRatgeberSlugs(): string[] {
  return RATGEBER_ARTICLES.map((a) => a.slug);
}
