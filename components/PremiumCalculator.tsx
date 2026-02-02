"use client";

import { useState, useRef, useMemo, useCallback, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface Person {
  id: string;
  gender: "m" | "f" | "k" | "";
  name: string;
  birthDate: string;
  birthYear: string;
  franchise: number;
  withAccident: boolean;
  isNewToSwitzerland: boolean;
  entryDate: string;
}

interface FormState {
  calculationType: "single" | "couple" | "family" | "unborn";
  plz: string;
  ort: string;
  canton: string;
  region: number;
  persons: Person[];
  currentInsurer: string;
  currentPremium: string;
  preference: "cheapest" | "recommended" | "offers";
  extras: string[];
}

interface PlzEntry {
  c: string;
  r: number;
  o: string;
}

interface PremiumRawEntry {
  id: number;
  n: string;
  t: string;
  tn: string;
  p: number;
}

interface PersonRawData {
  personId: string;
  personLabel: string;
  ageGroup: string;
  franchise: number;
  withAccident: boolean;
  entries: PremiumRawEntry[];
}

interface InsurerPersonTariff {
  personId: string;
  personLabel: string;
  ageGroup: string;
  cheapest: PremiumRawEntry;
  allTariffs: PremiumRawEntry[];
}

interface InsurerGroup {
  insurerId: number;
  insurerName: string;
  persons: InsurerPersonTariff[];
  totalMonthly: number;
  totalYearly: number;
  savings: number;
  modelTypes: string[];
}

type CantonData = Record<string, Record<string, PremiumRawEntry[]>>;
type PlzData = Record<string, PlzEntry[]>;

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const FRANCHISES_ADULT = [300, 500, 1000, 1500, 2000, 2500];
const FRANCHISES_CHILD = [0, 100, 200, 300, 400, 500, 600];
const DEFAULT_FRANCHISE_ADULT = 2500;
const DEFAULT_FRANCHISE_CHILD = 0;

// Vergütung 2026: CO2-Rückverteilung + Ausgleichsbetrag Reserveabbau
// Total: CHF 61.80/Jahr = CHF 5.15/Monat pro Person
// Quelle: BAG / Bundesamt für Gesundheit
const VERGUETUNG_MONTHLY_PER_PERSON = 5.15;

const CURRENT_INSURERS = [
  "Agrisano", "AMB", "Aquilana", "Assura", "Atupri", "Avenir",
  "Birchmeier", "Concordia", "CSS", "d'Entremont", "EGK", "Einsiedeln",
  "Galenos", "Glarner", "Helsana", "KPT", "Lumneziana",
  "Luzerner Hinterland", "Mutuel", "ÖKK", "Philos", "rhenusana",
  "sana24", "Sanitas", "SLKK", "sodalis", "Steffisburg", "Sumiswalder",
  "SWICA", "Sympany", "Visana", "Visperterminen", "vita surselva",
  "vivacare", "Wädenswil", "Andere",
];

const EXTRA_OPTIONS = [
  { id: "doctor", label: "Freie Arztwahl", desc: "Arzt & Spital frei wählen", icon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ), color: "from-blue-400 to-cyan-400" },
  { id: "complementary", label: "Alternativ\u00ADmedizin", desc: "Akupunktur, Homöopathie & Co.", icon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  ), color: "from-emerald-400 to-teal-400" },
  { id: "comfort", label: "Spitalkomfort", desc: "Halbprivat / Privat", icon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  ), color: "from-violet-400 to-purple-400" },
  { id: "transport", label: "Transport & Rettung", desc: "Ambulanz & Auslandsschutz", icon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  ), color: "from-orange-400 to-amber-400" },
  { id: "glasses", label: "Brillen & Linsen", desc: "Beiträge an Sehhilfen", icon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ), color: "from-sky-400 to-blue-400" },
  { id: "fitness", label: "Fitness & Vorsorge", desc: "Fitnessbeiträge & Check-ups", icon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ), color: "from-pink-400 to-rose-400" },
  { id: "dental", label: "Zahnpflege", desc: "Zahnarzt & Dentalhygiene", icon: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 2C4.5 2 3 4 3 6.5c0 3 1.5 5 3 7.5 1 1.5 1.5 3.5 2 5.5.3 1.3.5 2.5 1 2.5s.7-1.2 1-2.5c.3-1 .5-2 1-3 .5 1 .7 2 1 3 .3 1.3.5 2.5 1 2.5s.7-1.2 1-2.5c.5-2 1-4 2-5.5 1.5-2.5 3-4.5 3-7.5C21 4 19.5 2 17 2c-1.5 0-3 1-4 2.5h-2C10 3 8.5 2 7 2z" />
    </svg>
  ), color: "from-cyan-400 to-teal-400" },
  { id: "life", label: "Todesfall & IV", desc: "Absicherung für Angehörige", icon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ), color: "from-amber-400 to-yellow-400" },
];

const MODEL_LABELS: Record<string, string> = {
  standard: "Standard",
  hausarzt: "Hausarzt",
  hmo: "HMO",
  telmed: "Telmed",
};

const AGE_LABELS: Record<string, string> = {
  KIN: "Kind",
  JUG: "Junger Erwachsener",
  ERW: "Erwachsene/r",
};

// Lokale Logos (keine externen Requests mehr)
const LOCAL_LOGOS: Record<string, string> = {
  "Agrisano": "/logos/agrisano.svg",
  "Aquilana": "/logos/aquilana.svg",
  "Assura": "/logos/assura.svg",
  "Atupri": "/logos/atupri.svg",
  "Birchmeier": "/logos/birchmeier.svg",
  "CSS": "/logos/css.svg",
  "Concordia": "/logos/concordia.png",
  "EGK": "/logos/egk.svg",
  "Galenos": "/logos/galenos.svg",
  "Helsana": "/logos/helsana.svg",
  "KPT": "/logos/kpt.svg",
  "Luzerner Hinterland": "/logos/luzernerhinterland.svg",
  "SLKK": "/logos/slkk.svg",
  "SWICA": "/logos/swica.png",
  "Sanitas": "/logos/sanitas.svg",
  "Steffisburg": "/logos/steffisburg.svg",
  "Sumiswalder": "/logos/sumiswalder.svg",
  "Sympany": "/logos/sympany.svg",
  "Visana": "/logos/visana.svg",
  "Wädenswil": "/logos/waedenswil.svg",
  "rhenusana": "/logos/rhenusana.svg",
  "sana24": "/logos/sana24.svg",
  "vita surselva": "/logos/vitasurselva.svg",
  "ÖKK": "/logos/oekk.svg",
  // Groupe Mutuel Marken
  "Avenir": "/logos/groupemutuel.svg",
  "Mutuel": "/logos/groupemutuel.svg",
  "Philos": "/logos/groupemutuel.svg",
};

const INSURER_COLORS: Record<string, { bg: string; text: string }> = {
  "Agrisano":            { bg: "#4a8c2a", text: "#fff" },
  "Aquilana":            { bg: "#005da9", text: "#fff" },
  "Assura":              { bg: "#00a651", text: "#fff" },
  "Atupri":              { bg: "#009fe3", text: "#fff" },
  "Avenir":              { bg: "#e30613", text: "#fff" },
  "Birchmeier":          { bg: "#2c5aa0", text: "#fff" },
  "CSS":                 { bg: "#003b80", text: "#fff" },
  "Concordia":           { bg: "#0055a5", text: "#fff" },
  "EGK":                 { bg: "#6aab25", text: "#fff" },
  "Galenos":             { bg: "#1d4e89", text: "#fff" },
  "Helsana":             { bg: "#e2001a", text: "#fff" },
  "KPT":                 { bg: "#e64415", text: "#fff" },
  "Luzerner Hinterland": { bg: "#2e7d32", text: "#fff" },
  "Mutuel":              { bg: "#e30613", text: "#fff" },
  "Philos":              { bg: "#e30613", text: "#fff" },
  "SLKK":                { bg: "#1565c0", text: "#fff" },
  "SWICA":               { bg: "#78be20", text: "#fff" },
  "Sanitas":             { bg: "#c80078", text: "#fff" },
  "Steffisburg":         { bg: "#2e7d32", text: "#fff" },
  "Sumiswalder":         { bg: "#1a5276", text: "#fff" },
  "Sympany":             { bg: "#662d91", text: "#fff" },
  "Visana":              { bg: "#003399", text: "#fff" },
  "Wädenswil":           { bg: "#1565c0", text: "#fff" },
  "rhenusana":           { bg: "#00897b", text: "#fff" },
  "sana24":              { bg: "#00b200", text: "#fff" },
  "vita surselva":       { bg: "#388e3c", text: "#fff" },
  "ÖKK":                 { bg: "#e3000f", text: "#fff" },
};

function getInsurerLogoUrl(insurerName: string): string | null {
  return LOCAL_LOGOS[insurerName] || null;
}

function getInsurerInitials(name: string): string {
  if (name.length <= 4) return name.toUpperCase();
  const words = name.split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 3).toUpperCase();
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function getAgeGroup(birthYear: string): "KIN" | "JUG" | "ERW" {
  if (!birthYear) return "ERW";
  const year = parseInt(birthYear);
  if (isNaN(year)) return "ERW";
  const age = new Date().getFullYear() - year;
  if (age < 19) return "KIN";
  if (age < 26) return "JUG";
  return "ERW";
}

function getFranchisesForAge(ageGroup: string): number[] {
  return ageGroup === "KIN" ? FRANCHISES_CHILD : FRANCHISES_ADULT;
}

function getDefaultFranchise(ageGroup: string): number {
  return ageGroup === "KIN" ? DEFAULT_FRANCHISE_CHILD : DEFAULT_FRANCHISE_ADULT;
}

function createPerson(id?: string): Person {
  return {
    id: id || `p-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    gender: "",
    name: "",
    birthDate: "",
    birthYear: "",
    franchise: DEFAULT_FRANCHISE_ADULT,
    withAccident: false,
    isNewToSwitzerland: false,
    entryDate: "",
  };
}

function createUnbornPerson(id?: string): Person {
  const currentYear = new Date().getFullYear();
  return {
    id: id || `p-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    gender: "k",
    name: "Baby",
    birthDate: `01.01.${currentYear}`,
    birthYear: String(currentYear),
    franchise: DEFAULT_FRANCHISE_CHILD,
    withAccident: true,
    isNewToSwitzerland: false,
    entryDate: "",
  };
}

function buildLookupKey(ageGroup: string, withAccident: boolean, franchise: number): string {
  return `${ageGroup}-${withAccident ? "MIT" : "OHN"}-${franchise}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// GROUPED RESULTS COMPUTATION
// ═══════════════════════════════════════════════════════════════════════════

function computeGroupedResults(
  personDataList: PersonRawData[],
  modelFilter: string,
  currentPremiumTotal?: number
): InsurerGroup[] {
  if (personDataList.length === 0) return [];

  // Find insurers common to ALL persons (after model filter)
  const insurerSets = personDataList.map((pd) => {
    let entries = pd.entries;
    if (modelFilter !== "all") entries = entries.filter((e) => e.t === modelFilter);
    return new Set(entries.map((e) => e.id));
  });

  let commonIds = insurerSets[0];
  for (let i = 1; i < insurerSets.length; i++) {
    commonIds = new Set([...commonIds].filter((id) => insurerSets[i].has(id)));
  }

  const groups: InsurerGroup[] = [];

  for (const insurerId of commonIds) {
    const modelSet = new Set<string>();
    let totalMonthly = 0;
    const persons: InsurerPersonTariff[] = [];

    for (const pd of personDataList) {
      let entries = pd.entries.filter((e) => e.id === insurerId);
      if (modelFilter !== "all") entries = entries.filter((e) => e.t === modelFilter);
      entries.sort((a, b) => a.p - b.p);

      if (entries.length === 0) continue;

      const cheapest = entries[0];
      entries.forEach((e) => modelSet.add(e.t));
      totalMonthly += cheapest.p;

      persons.push({
        personId: pd.personId,
        personLabel: pd.personLabel,
        ageGroup: pd.ageGroup,
        cheapest,
        allTariffs: entries,
      });
    }

    if (persons.length !== personDataList.length) continue; // skip if not all persons covered

    const insurerName = persons[0].cheapest.n;

    // Vergütung abziehen (pro Person)
    const verguetungTotal = persons.length * VERGUETUNG_MONTHLY_PER_PERSON;
    const adjustedMonthly = totalMonthly - verguetungTotal;

    groups.push({
      insurerId,
      insurerName,
      persons,
      totalMonthly: Math.round(adjustedMonthly * 100) / 100,
      totalYearly: Math.round(adjustedMonthly * 12 * 100) / 100,
      savings: 0,
      modelTypes: [...modelSet].sort(),
    });
  }

  groups.sort((a, b) => a.totalMonthly - b.totalMonthly);

  // Calculate savings
  if (groups.length > 0) {
    const reference =
      currentPremiumTotal && currentPremiumTotal > 0
        ? currentPremiumTotal
        : groups[groups.length - 1].totalMonthly;

    groups.forEach((g) => {
      g.savings = Math.round((reference - g.totalMonthly) * 12);
      if (g.savings < 0) g.savings = 0;
    });
  }

  return groups;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function PremiumCalculator() {
  const [step, setStep] = useState(1);
  const [formState, setFormState] = useState<FormState>({
    calculationType: "single",
    plz: "",
    ort: "",
    canton: "",
    region: 0,
    persons: [createPerson("person-1")],
    currentInsurer: "",
    currentPremium: "",
    preference: "cheapest",
    extras: [],
  });

  // Data loading refs & state
  const plzDataRef = useRef<PlzData | null>(null);
  const premiumCacheRef = useRef<Record<string, CantonData>>({});
  const plzDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [plzLoading, setPlzLoading] = useState(false);
  const [premiumLoading, setPremiumLoading] = useState(false);

  // PLZ lookup state
  const [plzEntries, setPlzEntries] = useState<PlzEntry[]>([]);
  const [plzError, setPlzError] = useState("");
  const [showPlzSelect, setShowPlzSelect] = useState(false);

  // Results state
  const [personRawDataList, setPersonRawDataList] = useState<PersonRawData[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [modelFilter, setModelFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [expandedInsurer, setExpandedInsurer] = useState<number | null>(null);

  // Lead modal
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [extrasSubmitted, setExtrasSubmitted] = useState(false);
  const [selectedInsurers, setSelectedInsurers] = useState<string[]>([]);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadCountryCode, setLeadCountryCode] = useState("+41");
  const [leadConsent, setLeadConsent] = useState(true);
  const [leadNewsletter, setLeadNewsletter] = useState(true);
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadError, setLeadError] = useState("");

  // PLZ/Ort combo search
  const [plzQuery, setPlzQuery] = useState("");
  const [plzSuggestions, setPlzSuggestions] = useState<{ plz: string; entry: PlzEntry }[]>([]);
  const [showPlzDropdown, setShowPlzDropdown] = useState(false);
  const plzSearchRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Auto-scroll to active section when step changes (only forward)
  const prevStepRef = useRef(step);
  useEffect(() => {
    const goingForward = step > prevStepRef.current;
    prevStepRef.current = step;
    const el = sectionRefs.current[step];
    if (el && goingForward) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 250);
    }
  }, [step]);

  // Tooltips
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  // Custom franchise dropdown
  const [openFranchiseId, setOpenFranchiseId] = useState<string | null>(null);

  // ─── Data Loading ───────────────────────────────────────────────────────

  const loadPlzData = useCallback(async (): Promise<PlzData> => {
    if (plzDataRef.current) return plzDataRef.current;
    setPlzLoading(true);
    try {
      const res = await fetch("/data/plz-regions.json");
      if (!res.ok) throw new Error("PLZ data not found");
      const data: PlzData = await res.json();
      plzDataRef.current = data;
      return data;
    } catch (err) {
      console.error("Failed to load PLZ data:", err);
      throw err;
    } finally {
      setPlzLoading(false);
    }
  }, []);

  const loadCantonPremiums = useCallback(async (canton: string): Promise<CantonData> => {
    if (premiumCacheRef.current[canton]) return premiumCacheRef.current[canton];
    setPremiumLoading(true);
    try {
      const res = await fetch(`/data/premiums/${canton}.json`);
      if (!res.ok) throw new Error(`Premium data for ${canton} not found`);
      const data: CantonData = await res.json();
      premiumCacheRef.current[canton] = data;
      return data;
    } catch (err) {
      console.error(`Failed to load premiums for ${canton}:`, err);
      throw err;
    } finally {
      setPremiumLoading(false);
    }
  }, []);

  // ─── PLZ Handling (debounced) ───────────────────────────────────────────

  const handlePlzChange = useCallback(
    (plz: string) => {
      setFormState((prev) => ({ ...prev, plz }));
      setPlzError("");
      setShowPlzSelect(false);

      if (plz.length < 4) {
        setFormState((prev) => ({ ...prev, plz, canton: "", ort: "", region: 0 }));
        setPlzEntries([]);
        return;
      }

      // Debounce the actual lookup
      if (plzDebounceRef.current) clearTimeout(plzDebounceRef.current);

      if (plz.length === 4) {
        plzDebounceRef.current = setTimeout(async () => {
          try {
            const data = await loadPlzData();
            const entries = data[plz];

            if (!entries || entries.length === 0) {
              setPlzError("PLZ nicht gefunden. Bitte prüfe deine Eingabe.");
              setFormState((prev) => ({ ...prev, canton: "", ort: "", region: 0 }));
              setPlzEntries([]);
              return;
            }

            setPlzEntries(entries);

            // Auto-select first entry
            setFormState((prev) => ({
              ...prev,
              canton: entries[0].c,
              ort: entries[0].o,
              region: entries[0].r,
            }));

            if (entries.length > 1) setShowPlzSelect(true);

            // Preload canton premium data in background
            loadCantonPremiums(entries[0].c).catch(() => {});
          } catch {
            setPlzError("Fehler beim Laden der PLZ-Daten.");
          }
        }, 150);
      }
    },
    [loadPlzData, loadCantonPremiums]
  );

  const handlePlzEntrySelect = useCallback(
    (index: number) => {
      const entry = plzEntries[index];
      if (entry) {
        setFormState((prev) => ({
          ...prev,
          canton: entry.c,
          ort: entry.o,
          region: entry.r,
        }));
        // Preload new canton if different
        loadCantonPremiums(entry.c).catch(() => {});
      }
    },
    [plzEntries, loadCantonPremiums]
  );

  // ─── Person Management ─────────────────────────────────────────────────

  const updatePerson = useCallback((id: string, updates: Partial<Person>) => {
    setFormState((prev) => ({
      ...prev,
      persons: prev.persons.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, ...updates };

        // Auto-derive birthYear from birthDate (DD.MM.YYYY → YYYY)
        if (updates.birthDate !== undefined) {
          const parts = updated.birthDate.split(".");
          if (parts.length === 3 && parts[2].length === 4) {
            updated.birthYear = parts[2];
          } else {
            updated.birthYear = "";
          }
        }

        // Auto-reset franchise when age group changes
        if (updates.birthDate !== undefined || updates.birthYear !== undefined) {
          const oldAgeGroup = getAgeGroup(p.birthYear);
          const newAgeGroup = getAgeGroup(updated.birthYear);
          if (oldAgeGroup !== newAgeGroup) {
            const validFranchises = getFranchisesForAge(newAgeGroup);
            if (!validFranchises.includes(updated.franchise)) {
              updated.franchise = getDefaultFranchise(newAgeGroup);
            }
          }
        }

        return updated;
      }),
    }));
  }, []);

  const addPerson = useCallback(() => {
    setFormState((prev) => {
      const newPersons = [...prev.persons, createPerson()];
      const calcType = newPersons.length === 1 ? "single" : newPersons.length === 2 ? "couple" : "family";
      return { ...prev, persons: newPersons, calculationType: calcType };
    });
  }, []);

  const removePerson = useCallback((id: string) => {
    setFormState((prev) => {
      const newPersons = prev.persons.filter((p) => p.id !== id);
      const calcType = newPersons.length === 1 ? "single" : newPersons.length === 2 ? "couple" : "family";
      return { ...prev, persons: newPersons, calculationType: calcType };
    });
  }, []);

  // ─── Calculate Results (multi-person) ──────────────────────────────────

  const calculateResults = useCallback(async () => {
    setPremiumLoading(true);
    try {
      const cantonData = await loadCantonPremiums(formState.canton);
      const regionStr = String(formState.region);
      const regionData = cantonData[regionStr];

      if (!regionData) {
        setPersonRawDataList([]);
        setShowResults(true);
        return;
      }

      const results: PersonRawData[] = [];

      for (let i = 0; i < formState.persons.length; i++) {
        const person = formState.persons[i];
        const ageGroup = getAgeGroup(person.birthYear);
        const key = buildLookupKey(ageGroup, person.withAccident, person.franchise);
        const entries = regionData[key] || [];

        results.push({
          personId: person.id,
          personLabel: formState.persons.length > 1 ? (person.name || `Person ${i + 1}`) : "",
          ageGroup,
          franchise: person.franchise,
          withAccident: person.withAccident,
          entries,
        });
      }

      setPersonRawDataList(results);
      setExpandedInsurer(null);

      // Always show results first
      setShowResults(true);

      // If lead not yet captured, show modal after a short delay
      // so the customer sees the results briefly and knows what they'll get
      if (!leadSubmitted) {
        const firstName = formState.persons[0]?.name || "";
        if (firstName && !leadName) setLeadName(firstName);
        setTimeout(() => {
          setShowLeadModal(true);
        }, 1200);
      }
    } catch {
      setPersonRawDataList([]);
      setShowResults(true);
    } finally {
      setPremiumLoading(false);
    }
  }, [formState, loadCantonPremiums, leadSubmitted, leadName]);

  // ─── Derived: Grouped Results ──────────────────────────────────────────

  const currentPremiumNum = parseFloat(formState.currentPremium) || 0;
  const isMultiPerson = formState.persons.length > 1;

  const groupedResults = useMemo(() => {
    let groups = computeGroupedResults(
      personRawDataList,
      modelFilter,
      currentPremiumNum > 0 ? currentPremiumNum : undefined
    );
    if (sortOrder === "desc") groups = [...groups].reverse();
    return groups;
  }, [personRawDataList, modelFilter, currentPremiumNum, sortOrder]);

  const maxSavings = useMemo(() => {
    if (groupedResults.length === 0) return 0;
    const sorted = [...groupedResults].sort((a, b) => a.totalMonthly - b.totalMonthly);
    return sorted[0].savings;
  }, [groupedResults]);

  const uniqueInsurerCount = useMemo(
    () => new Set(groupedResults.map((g) => g.insurerId)).size,
    [groupedResults]
  );

  // ─── Step Validation ───────────────────────────────────────────────────

  const canProceed = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return formState.canton !== "" && formState.ort !== "" && !plzError;
      case 2:
        return formState.persons.every(
          (p) => p.birthDate.length === 10 && p.birthYear !== "" && p.franchise > -1
        );
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  // ─── Lead Submit ───────────────────────────────────────────────────────

  const handleLeadSubmit = async () => {
    if (!leadConsent || !leadName || !leadEmail || !leadPhone) return;
    setLeadLoading(true);
    setLeadError("");

    try {
      const cheapest = groupedResults.length > 0
        ? [...groupedResults].sort((a, b) => a.totalMonthly - b.totalMonthly)[0]
        : null;

      // Build persons array with all details
      const personsData = formState.persons.map((p, i) => ({
        name: p.name || `Person ${i + 1}`,
        gender: p.gender,
        birthDate: p.birthDate,
        birthYear: p.birthYear,
        ageGroup: getAgeGroup(p.birthYear),
        franchise: p.franchise,
        withAccident: p.withAccident,
        isNewToSwitzerland: p.isNewToSwitzerland,
        entryDate: p.entryDate || "",
      }));

      console.log("[LEAD POST] sending", personsData.length, "persons:", personsData);
      console.log("[LEAD POST] extras at submit time:", formState.extras);

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadName,
          email: leadEmail,
          phone: `${leadCountryCode} ${leadPhone}`,
          plz: formState.plz,
          ort: formState.ort,
          canton: formState.canton,
          persons: personsData,
          model: modelFilter,
          currentInsurer: formState.currentInsurer === "keine" ? "Neu in der Schweiz" : formState.currentInsurer,
          currentPremium: currentPremiumAuto ? String(currentPremiumAuto) : formState.currentPremium,
          cheapestInsurer: cheapest?.insurerName || "",
          cheapestPremium: cheapest?.totalMonthly || 0,
          extras: formState.extras,
          newsletter: leadNewsletter,
          calculationType: formState.calculationType,
          personsCount: formState.persons.length,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("[LEAD POST] success, id:", data.id);
        setLeadId(data.id || null);
        setLeadSubmitted(true);
        setShowLeadModal(false);
        setShowResults(true);
        if (typeof window !== "undefined" && (window as any).fbq) {
          (window as any).fbq("track", "Lead");
        }
      } else {
        const errData = await res.json().catch(() => null);
        const debugInfo = errData?.debug ? ` (${errData.debug})` : "";
        setLeadError(`${errData?.error || "Unbekannter Fehler"}${debugInfo}`);
      }
    } catch {
      setLeadError("Verbindungsfehler. Bitte prüfe deine Internetverbindung.");
    } finally {
      setLeadLoading(false);
    }
  };

  // ─── Cleanup debounce on unmount ───────────────────────────────────────

  useEffect(() => {
    return () => {
      if (plzDebounceRef.current) clearTimeout(plzDebounceRef.current);
      if (plzSearchRef.current) clearTimeout(plzSearchRef.current);
    };
  }, []);

  // ─── PLZ/Ort combo search ─────────────────────────────────────────────

  const handlePlzSuggestionSelect = useCallback(
    (plz: string, entry: PlzEntry, autoAdvance = true) => {
      setPlzQuery(`${plz} ${entry.o}`);
      setShowPlzDropdown(false);
      setPlzSuggestions([]);
      setFormState((prev) => ({
        ...prev,
        plz,
        canton: entry.c,
        ort: entry.o,
        region: entry.r,
      }));
      // Preload canton data
      loadCantonPremiums(entry.c).catch(() => {});
      // Auto-advance to Step 2 after short delay for visual feedback
      if (autoAdvance) {
        setTimeout(() => setStep(2), 500);
      }
    },
    [loadCantonPremiums]
  );

  const handlePlzQueryChange = useCallback(
    async (query: string) => {
      setPlzQuery(query);
      setPlzError("");

      if (query.length < 2) {
        setPlzSuggestions([]);
        setShowPlzDropdown(false);
        // Reset if user clears
        if (query.length === 0) {
          setFormState((prev) => ({ ...prev, plz: "", canton: "", ort: "", region: 0 }));
        }
        return;
      }

      if (plzSearchRef.current) clearTimeout(plzSearchRef.current);

      plzSearchRef.current = setTimeout(async () => {
        try {
          const data = await loadPlzData();
          const isNumeric = /^\d+$/.test(query);
          const results: { plz: string; entry: PlzEntry }[] = [];
          const seen = new Set<string>();

          for (const [plz, entries] of Object.entries(data)) {
            for (const entry of entries) {
              const key = `${plz}-${entry.o}-${entry.c}`;
              if (seen.has(key)) continue;

              const match = isNumeric
                ? plz.startsWith(query)
                : entry.o.toLowerCase().startsWith(query.toLowerCase());

              if (match) {
                seen.add(key);
                results.push({ plz, entry });
                if (results.length >= 8) break;
              }
            }
            if (results.length >= 8) break;
          }

          // Sort: exact PLZ first, then alphabetically
          results.sort((a, b) => {
            if (isNumeric) return a.plz.localeCompare(b.plz);
            return a.entry.o.localeCompare(b.entry.o);
          });

          // Auto-select: if full 4-digit PLZ with exactly 1 result
          if (isNumeric && query.length === 4 && results.length === 1) {
            handlePlzSuggestionSelect(results[0].plz, results[0].entry, true);
            return;
          }

          setPlzSuggestions(results);
          setShowPlzDropdown(results.length > 0);
        } catch {
          setPlzSuggestions([]);
          setShowPlzDropdown(false);
        }
      }, 200);
    },
    [loadPlzData, handlePlzSuggestionSelect]
  );

  // ─── Auto-calculate current premium from BAG data ──────────────────

  const [currentPremiumAuto, setCurrentPremiumAuto] = useState<number | null>(null);
  const [currentPremiumLoading, setCurrentPremiumLoading] = useState(false);

  useEffect(() => {
    if (!formState.currentInsurer || formState.currentInsurer === "keine" || formState.currentInsurer === "" || !formState.canton) {
      setCurrentPremiumAuto(null);
      return;
    }

    let cancelled = false;
    setCurrentPremiumLoading(true);

    (async () => {
      try {
        const cantonData = await loadCantonPremiums(formState.canton);
        const regionStr = String(formState.region);
        const regionData = cantonData[regionStr];
        if (!regionData || cancelled) { setCurrentPremiumAuto(null); setCurrentPremiumLoading(false); return; }

        let totalMonthly = 0;
        let allFound = true;

        for (const person of formState.persons) {
          const ageGroup = getAgeGroup(person.birthYear);
          const key = buildLookupKey(ageGroup, person.withAccident, person.franchise);
          const entries = regionData[key] || [];

          // Find entries matching current insurer
          let insurerEntries = entries.filter((e) => e.n === formState.currentInsurer);

          // Filter by model if specific model selected
          if (modelFilter !== "all") {
            const modelEntries = insurerEntries.filter((e) => e.t === modelFilter);
            if (modelEntries.length > 0) insurerEntries = modelEntries;
          }

          if (insurerEntries.length > 0) {
            // Use cheapest tariff for this insurer
            const cheapest = insurerEntries.reduce((a, b) => a.p < b.p ? a : b);
            totalMonthly += cheapest.p;
          } else {
            allFound = false;
          }
        }

        if (!cancelled) {
          // Vergütung abziehen (pro Person)
          const verguetungTotal = formState.persons.length * VERGUETUNG_MONTHLY_PER_PERSON;
          const adjustedTotal = allFound ? totalMonthly - verguetungTotal : null;
          setCurrentPremiumAuto(adjustedTotal);
          // Also set in formState for lead data
          if (allFound && adjustedTotal !== null) {
            setFormState((prev) => ({ ...prev, currentPremium: String(Math.round(adjustedTotal * 100) / 100) }));
          }
          setCurrentPremiumLoading(false);
        }
      } catch {
        if (!cancelled) { setCurrentPremiumAuto(null); setCurrentPremiumLoading(false); }
      }
    })();

    return () => { cancelled = true; };
  }, [formState.currentInsurer, formState.canton, formState.region, formState.persons, modelFilter, loadCantonPremiums]);

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════

  // Step labels moved inline into sections

  const InfoTooltip = ({ id, text }: { id: string; text: string }) => (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveTooltip(activeTooltip === id ? null : id); }}
        className="w-5 h-5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-white/40 text-[10px] font-bold flex items-center justify-center ml-1.5 transition-colors shrink-0"
      >
        i
      </button>
      {activeTooltip === id && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setActiveTooltip(null)} />
          <div className="fixed z-50 left-4 right-4 sm:absolute sm:left-auto sm:right-0 sm:bottom-full sm:w-72 sm:mb-2 bottom-auto top-1/3 sm:top-auto p-4 sm:p-3.5 rounded-xl text-white text-sm sm:text-xs leading-relaxed shadow-2xl"
               style={{ background: 'rgba(15, 26, 58, 0.98)', border: '1px solid rgba(255,255,255,0.15)' }}>
            {text}
          </div>
        </>
      )}
    </span>
  );

  const CALC_TYPE_LABELS: Record<string, string> = { single: "Einzelperson", couple: "Paar", family: "Familie", unborn: "Ungeborenes Kind" };

  return (
    <div className="max-w-3xl mx-auto relative">
      {/* Vertical connector line */}
      <div className="absolute left-[2.15rem] top-12 bottom-12 w-0.5 bg-gradient-to-b from-blue-500/30 via-blue-500/10 to-transparent pointer-events-none z-0 hidden sm:block" />

      <div className="space-y-3 relative z-10">
      {/* Loading overlay */}
      {premiumLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050a18]/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60 font-medium">Prämien werden berechnet...</p>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 1: Situation & Wohnort                                    */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div ref={(el) => { sectionRefs.current[1] = el; }} className="card-elevated overflow-visible" style={{ scrollMarginTop: "5.5rem" }}>
        {/* Section header */}
        <div
          className={`flex items-center gap-3 p-5 ${step > 1 ? "cursor-pointer hover:bg-white/[0.02] transition-colors" : ""}`}
          onClick={() => step > 1 && setStep(1)}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
            step > 1 ? "bg-blue-500 text-white" : step === 1 ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30" : "bg-white/[0.06] text-white/40"
          }`}>
            {step > 1 ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            ) : "1"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white/80">Situation & Wohnort</div>
            {step > 1 && (
              <div className="text-xs text-white/40 truncate">
                {CALC_TYPE_LABELS[formState.calculationType] || formState.calculationType} · {formState.plz} {formState.ort} ({formState.canton})
              </div>
            )}
          </div>
          {step > 1 && (
            <span className="text-xs text-blue-400 font-medium shrink-0">Ändern</span>
          )}
        </div>

        {/* Section content */}
        {step === 1 && (
          <div className="px-5 pb-6 sm:px-8 sm:pb-8 animate-slide-down">
            <h2 className="text-xl font-bold text-center mb-6">
              Für wen möchtest du jetzt Prämien berechnen?
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {(
                [
                  { value: "single", label: "Einzelperson", icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                    </svg>
                  )},
                  { value: "couple", label: "Paar", icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                  )},
                  { value: "family", label: "Familie", icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                  )},
                  { value: "unborn", label: "Ungeborenes Kind", icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  )},
                ] as const
              ).map((type) => (
                <button
                  key={type.value}
                  onClick={() => {
                    let persons: Person[];
                    switch (type.value) {
                      case "couple":
                        persons = [createPerson("p1"), createPerson("p2")];
                        break;
                      case "family":
                        persons = [createPerson("p1"), createPerson("p2"), createPerson("p3")];
                        break;
                      case "unborn":
                        persons = [createUnbornPerson("p1")];
                        break;
                      default:
                        persons = [createPerson("p1")];
                    }
                    setFormState((prev) => ({ ...prev, calculationType: type.value, persons }));
                  }}
                  className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all ${
                    formState.calculationType === type.value
                      ? "border-blue-500 bg-blue-500/10 text-blue-400"
                      : "border-white/[0.08] hover:border-white/[0.12] text-white/50"
                  }`}
                >
                  {type.icon}
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              ))}
            </div>

            {/* PLZ / Ort combo search */}
            <div className="max-w-sm mx-auto">
              <h3 className="font-semibold mb-1">Prämienregion wählen</h3>
              <p className="text-sm text-white/50 mb-3">Die Prämien ändern sich je nach Region</p>
              <div className="relative">
                <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1">PLZ / Ort *</label>
                <input
                  type="text"
                  placeholder="PLZ oder Ort eingeben"
                  value={plzQuery}
                  onChange={(e) => handlePlzQueryChange(e.target.value)}
                  onFocus={() => plzSuggestions.length > 0 && setShowPlzDropdown(true)}
                  className={`input-field text-lg ${plzError ? "!border-red-500/40" : ""}`}
                />
                {plzLoading && (
                  <span className="absolute right-4 bottom-3">
                    <div className="w-4 h-4 border-2 border-white/[0.12] border-t-blue-500 rounded-full animate-spin" />
                  </span>
                )}
                {!plzLoading && formState.canton && (
                  <span className="absolute right-4 bottom-3 text-sm text-emerald-500">✓</span>
                )}

                {/* Dropdown */}
                {showPlzDropdown && plzSuggestions.length > 0 && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowPlzDropdown(false)} />
                    <div className="absolute z-40 top-full left-0 right-0 mt-1 bg-[#0f1a3a] border border-white/[0.08] rounded-xl shadow-xl max-h-64 overflow-y-auto">
                      {plzSuggestions.map((s, idx) => (
                        <button
                          key={`${s.plz}-${s.entry.o}-${idx}`}
                          onClick={() => handlePlzSuggestionSelect(s.plz, s.entry)}
                          className="w-full px-4 py-3 text-left text-sm hover:bg-white/[0.04] flex items-center justify-between border-b border-white/[0.04] last:border-0 transition-colors"
                        >
                          <span>
                            <span className="font-medium">{s.plz}</span>{" "}
                            <span className="text-white/60">{s.entry.o}</span>
                          </span>
                          <span className="text-xs text-white/40 ml-2">{s.entry.c}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {plzError && <p className="text-red-400 text-sm mt-2">{plzError}</p>}

              {formState.canton && (
                <p className="text-xs text-white/40 mt-2">
                  Prämienregion: {formState.canton}-{formState.region} • {formState.ort}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 2: Persönliche Angaben                                    */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {step >= 2 && (
        <div ref={(el) => { sectionRefs.current[2] = el; }} className="card-elevated overflow-visible" style={{ scrollMarginTop: "5.5rem" }}>
          {/* Section header */}
          <div
            className={`flex items-center gap-3 p-5 ${step > 2 ? "cursor-pointer hover:bg-white/[0.02] transition-colors" : ""}`}
            onClick={() => step > 2 && setStep(2)}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
              step > 2 ? "bg-blue-500 text-white" : step === 2 ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30" : "bg-white/[0.06] text-white/40"
            }`}>
              {step > 2 ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              ) : "2"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white/80">Persönliche Angaben</div>
              {step > 2 && (
                <div className="text-xs text-white/40 truncate">
                  {formState.persons.map((p, i) => {
                    const ag = getAgeGroup(p.birthYear);
                    return `${p.name || `Person ${i+1}`} (${AGE_LABELS[ag]}, Fr. ${p.franchise})`;
                  }).join(" · ")}
                </div>
              )}
            </div>
            {step > 2 && (
              <span className="text-xs text-blue-400 font-medium shrink-0">Ändern</span>
            )}
          </div>

          {/* Section content */}
          {step === 2 && (
            <div className="px-5 pb-6 sm:px-8 sm:pb-8 animate-slide-down">
              <div className="space-y-6">
                {formState.persons.map((person, idx) => {
                const ageGroup = getAgeGroup(person.birthYear);
                const franchises = getFranchisesForAge(ageGroup);
                const isUnborn = formState.calculationType === "unborn" && idx === 0;

                return (
                  <div key={person.id} className="p-5 rounded-xl bg-white/[0.04] border border-white/[0.08]" style={{ overflow: 'visible' }}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-white/80">
                        {isUnborn ? "Ungeborenes Kind" : `Person ${idx + 1}`}
                        {person.birthYear && (
                          <span className="text-xs font-normal text-white/40 ml-2">
                            ({AGE_LABELS[ageGroup]})
                          </span>
                        )}
                      </h3>
                      {idx > 0 && (
                        <button
                          onClick={() => removePerson(person.id)}
                          className="text-sm text-red-400 hover:text-red-300"
                        >
                          Entfernen
                        </button>
                      )}
                    </div>

                    {/* Gender: 3 options */}
                    <div className="mb-4">
                      <label className="block text-xs text-white/50 mb-2">Geschlecht</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(
                          [
                            { value: "m" as const, label: "Männlich", icon: (
                              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                              </svg>
                            )},
                            { value: "f" as const, label: "Weiblich", icon: (
                              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                              </svg>
                            )},
                            { value: "k" as const, label: "Kind", icon: (
                              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                              </svg>
                            )},
                          ]
                        ).map((g) => (
                          <button
                            key={g.value}
                            onClick={() => {
                              const updates: Partial<Person> = { gender: g.value };
                              // Kinder brauchen Unfalldeckung (nicht über Arbeitgeber versichert)
                              if (g.value === "k") {
                                updates.withAccident = true;
                              } else {
                                updates.withAccident = false;
                              }
                              updatePerson(person.id, updates);
                            }}
                            className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-2 rounded-lg text-xs sm:text-sm font-medium border transition-all ${
                              person.gender === g.value
                                ? "border-blue-500 bg-blue-500/10 text-blue-400"
                                : "border-white/[0.08] text-white/50 hover:border-white/[0.12]"
                            }`}
                          >
                            {g.icon}
                            {g.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-white/50 mb-1">Vor- und Nachname *</label>
                        <input
                          type="text"
                          placeholder={isUnborn ? "Baby" : "Vor- und Nachname"}
                          value={person.name}
                          onChange={(e) => updatePerson(person.id, { name: e.target.value })}
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-white/50 mb-1">Geburtsdatum *</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="TT.MM.JJJJ"
                          value={person.birthDate}
                          onChange={(e) => {
                            let v = e.target.value.replace(/[^\d.]/g, "");
                            const digits = v.replace(/\./g, "");
                            if (digits.length >= 5) {
                              v = digits.slice(0, 2) + "." + digits.slice(2, 4) + "." + digits.slice(4, 8);
                            } else if (digits.length >= 3) {
                              v = digits.slice(0, 2) + "." + digits.slice(2);
                            }
                            updatePerson(person.id, { birthDate: v });
                          }}
                          maxLength={10}
                          className={`input-field max-w-[11rem] ${
                            person.birthYear && (parseInt(person.birthYear) < 1920 || parseInt(person.birthYear) > new Date().getFullYear())
                              ? "!border-red-500/40"
                              : ""
                          }`}
                        />
                        {person.birthYear && person.birthDate.length === 10 && (
                          <p className="text-xs text-white/40 mt-1">
                            {AGE_LABELS[getAgeGroup(person.birthYear)]} ({new Date().getFullYear() - parseInt(person.birthYear)} J.)
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs text-white/50 mb-1">Franchise *</label>
                        <div className="relative" ref={(el) => {
                          if (el) el.setAttribute('data-franchise-id', person.id);
                        }}>
                          <button
                            type="button"
                            onClick={() => setOpenFranchiseId(openFranchiseId === person.id ? null : person.id)}
                            className="w-full px-4 py-3 rounded-xl text-left flex items-center justify-between transition-all duration-150"
                            style={{
                              background: 'rgba(255,255,255,0.06)',
                              border: openFranchiseId === person.id ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                              boxShadow: openFranchiseId === person.id ? '0 0 0 3px rgba(59,130,246,0.15)' : 'none',
                            }}
                          >
                            <span className={franchises.includes(person.franchise) ? "text-white" : "text-white/40"}>
                              {franchises.includes(person.franchise) ? `CHF ${person.franchise.toLocaleString("de-CH")}` : "Wählen"}
                            </span>
                            <svg className={`w-4 h-4 text-white/40 transition-transform ${openFranchiseId === person.id ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                            </svg>
                          </button>
                          {openFranchiseId === person.id && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setOpenFranchiseId(null)} />
                              <div className="absolute z-50 top-full left-0 right-0 mt-1 py-1 rounded-xl shadow-2xl"
                                   style={{ background: '#0f1a3a', border: '1px solid rgba(255,255,255,0.12)' }}>
                                {franchises.map((f) => (
                                  <button
                                    key={f}
                                    type="button"
                                    onClick={() => {
                                      updatePerson(person.id, { franchise: f });
                                      setOpenFranchiseId(null);
                                    }}
                                    className={`w-full px-4 py-2.5 text-sm text-left transition-colors flex items-center justify-between ${
                                      person.franchise === f
                                        ? "bg-blue-500/15 text-blue-400"
                                        : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                                    }`}
                                  >
                                    <span>CHF {f.toLocaleString("de-CH")}</span>
                                    {person.franchise === f && (
                                      <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                      </svg>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Toggles with info tooltips */}
                    <div className="flex flex-wrap gap-x-8 gap-y-3 mt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <button
                          type="button"
                          className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${person.withAccident ? "bg-blue-500" : "bg-white/[0.15]"}`}
                          onClick={() => updatePerson(person.id, { withAccident: !person.withAccident })}
                        >
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${person.withAccident ? "translate-x-5" : "translate-x-0.5"}`} />
                        </button>
                        <span className="cursor-pointer" onClick={() => updatePerson(person.id, { withAccident: !person.withAccident })}>
                          Unfalldeckung einschliessen
                        </span>
                        <InfoTooltip id={`accident-${person.id}`} text="Wähle dies, wenn du nicht über deinen Arbeitgeber gegen Unfall versichert bist. Angestellte mit 8+ Stunden/Woche sind in der Regel über den Arbeitgeber versichert." />
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <button
                          type="button"
                          className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${person.isNewToSwitzerland ? "bg-blue-500" : "bg-white/[0.15]"}`}
                          onClick={() => updatePerson(person.id, { isNewToSwitzerland: !person.isNewToSwitzerland })}
                        >
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${person.isNewToSwitzerland ? "translate-x-5" : "translate-x-0.5"}`} />
                        </button>
                        <span className="cursor-pointer" onClick={() => updatePerson(person.id, { isNewToSwitzerland: !person.isNewToSwitzerland })}>
                          Neu in der Schweiz
                        </span>
                        <InfoTooltip id={`new-ch-${person.id}`} text="Du bist neu in der Schweiz und hast dich innerhalb der letzten 3 Monate angemeldet? Dann hast du 3 Monate Zeit, eine Krankenkasse zu wählen." />
                      </div>
                    </div>

                    {person.isNewToSwitzerland && (
                      <div className="mt-3">
                        <label className="block text-xs text-white/50 mb-1">Einreisedatum</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="TT.MM.JJJJ"
                          value={person.entryDate}
                          onChange={(e) => {
                            // Auto-format: add dots after DD and MM
                            let v = e.target.value.replace(/[^\d.]/g, "");
                            // Remove extra dots and reformat
                            const digits = v.replace(/\./g, "");
                            if (digits.length >= 5) {
                              v = digits.slice(0, 2) + "." + digits.slice(2, 4) + "." + digits.slice(4, 8);
                            } else if (digits.length >= 3) {
                              v = digits.slice(0, 2) + "." + digits.slice(2);
                            }
                            updatePerson(person.id, { entryDate: v });
                          }}
                          maxLength={10}
                          className="input-field max-w-[11rem]"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={addPerson}
                className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-2"
              >
                <span className="w-6 h-6 rounded-full bg-blue-500/15 flex items-center justify-center text-blue-400">+</span>
                Personen hinzufügen
              </button>
              {formState.calculationType !== "unborn" && (
                <button
                  onClick={() => {
                    setFormState((prev) => ({
                      ...prev,
                      persons: [...prev.persons, createUnbornPerson()],
                    }));
                  }}
                  className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-2"
                >
                  <span className="w-6 h-6 rounded-full bg-blue-500/15 flex items-center justify-center text-blue-400">+</span>
                  Ungeborenes Kind hinzufügen
                </button>
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setStep(3)}
                disabled={!canProceed(2)}
                className="btn-accent px-10 py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Weiter
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 3: Aktuelle Versicherung + Results                        */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {step >= 3 && (
        <div ref={(el) => { sectionRefs.current[3] = el; }} className="card-elevated overflow-visible" style={{ scrollMarginTop: "5.5rem" }}>
          {/* Section header */}
          {!showResults && (
            <div className="flex items-center gap-3 p-5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                step >= 3 ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30" : "bg-white/[0.06] text-white/40"
              }`}>
                3
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white/80">Aktuelle Versicherung</div>
              </div>
            </div>
          )}

          {/* Section content */}
          {step === 3 && (
            <div className="animate-fade-in">
              {!showResults ? (
                <div className="px-5 pb-6 sm:px-8 sm:pb-8">
                <div className="max-w-md mx-auto space-y-6">
                  {/* Current insurer */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Bei welcher Krankenkasse bist du aktuell?
                    </label>
                    <select
                      value={formState.currentInsurer}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormState((prev) => ({
                          ...prev,
                          currentInsurer: val,
                          currentPremium: val === "" || val === "keine" ? "" : prev.currentPremium,
                        }));
                      }}
                      className="select-field"
                    >
                      <option value="">Bitte wählen...</option>
                      <option value="keine">🆕 Keine — Ich bin neu in der Schweiz</option>
                      {CURRENT_INSURERS.map((ins) => (
                        <option key={ins} value={ins}>{ins}</option>
                      ))}
                    </select>
                  </div>

                  {/* Auto-calculated current premium */}
                  {formState.currentInsurer && formState.currentInsurer !== "keine" && (
                    <div className="animate-fade-in p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                      <div className="text-sm text-white/60 mb-1">Deine aktuelle Prämie bei {formState.currentInsurer}:</div>
                      {currentPremiumLoading ? (
                        <div className="flex items-center gap-2 text-white/40">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span className="text-sm">Wird berechnet...</span>
                        </div>
                      ) : currentPremiumAuto !== null ? (
                        <div>
                          <span className="text-2xl font-bold text-white">
                            CHF {currentPremiumAuto.toFixed(2)}
                          </span>
                          <span className="text-sm text-white/40 ml-1">/ Monat{isMultiPerson ? " (Total)" : ""}</span>
                          {modelFilter !== "all" && (
                            <div className="text-xs text-white/30 mt-1">
                              Günstigster {modelFilter === "standard" ? "Standard" : modelFilter === "hausarzt" ? "Hausarzt" : modelFilter === "hmo" ? "HMO" : "Telmed"}-Tarif
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-white/40">
                          {formState.currentInsurer} bietet {modelFilter !== "all" ? `kein ${modelFilter}-Modell` : "keine Tarife"} in deiner Region an.
                        </div>
                      )}
                    </div>
                  )}

                  {formState.currentInsurer === "keine" && (
                    <div className="animate-fade-in p-4 rounded-xl bg-blue-500/5 border border-blue-500/15 text-sm text-white/50">
                      🇨🇭 Willkommen in der Schweiz! Wir zeigen dir alle verfügbaren Krankenkassen sortiert nach Preis.
                    </div>
                  )}

                  {/* Model selection */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Welches Versicherungsmodell bevorzugst du?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {([
                        { value: "all", label: "Weiss nicht", desc: "Alle Modelle zeigen" },
                        { value: "standard", label: "Standard", desc: "Freie Arztwahl" },
                        { value: "hausarzt", label: "Hausarzt", desc: "Über deinen Hausarzt" },
                        { value: "hmo", label: "HMO", desc: "Gesundheitszentrum" },
                        { value: "telmed", label: "Telmed", desc: "Erst anrufen" },
                      ] as const).map((m) => (
                        <button
                          key={m.value}
                          onClick={() => setModelFilter(m.value)}
                          className={`py-3 px-3 rounded-xl text-center border-2 transition-all ${
                            modelFilter === m.value
                              ? "border-blue-500 bg-blue-500/15 text-white shadow-lg shadow-blue-500/10"
                              : "border-white/[0.06] bg-white/[0.03] hover:border-white/[0.12] text-white/60"
                          }`}
                        >
                          <div className="text-sm font-semibold">{m.label}</div>
                          <div className="text-[10px] text-white/40 mt-0.5">{m.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={calculateResults}
                    disabled={premiumLoading}
                    className="btn-accent px-8 py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {premiumLoading && (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    Ergebnis anzeigen
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
                </div>
              ) : (
              /* ── INLINE RESULTS ── */
              <div className="p-5 sm:p-8">
                {(() => {
                  const summaryParts: string[] = [
                    `${formState.plz} ${formState.ort} (${formState.canton})`,
                  ];
                  if (isMultiPerson) {
                    summaryParts.push(`${formState.persons.length} Personen`);
                  } else {
                    const p = formState.persons[0];
                    const ag = p ? getAgeGroup(p.birthYear) : "ERW";
                    summaryParts.push(AGE_LABELS[ag] || ag);
                    summaryParts.push(`Franchise CHF ${p?.franchise?.toLocaleString("de-CH")}`);
                  }

                  return (
                    <>
                      <h2 className="text-2xl font-bold text-center mb-2">
                        Dein Prämienvergleich 2026
                      </h2>
                      <p className="text-center text-white/50 mb-1">{summaryParts.join(" • ")}</p>
                      <p className="text-center text-xs text-white/40 mb-6">
                        Offizielle Daten: Bundesamt für Gesundheit (BAG)
                      </p>
                    </>
                  );
                })()}

                {/* Multi-person summary */}
                {isMultiPerson && (
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {personRawDataList.map((pd, i) => (
                      <span key={pd.personId} className="text-xs bg-white/[0.06] text-white/60 px-3 py-1 rounded-full">
                        {formState.persons[i]?.name || `Person ${i + 1}`}: {AGE_LABELS[pd.ageGroup]} • Fr. {formState.persons[i]?.franchise}
                      </span>
                    ))}
                  </div>
                )}

                {/* Savings highlight */}
                {maxSavings > 0 && (
                  <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-5 mb-6 text-center">
                    <div className="text-sm font-medium text-emerald-400">
                      {currentPremiumNum > 0 ? "Deine mögliche Ersparnis pro Jahr" : "Sparpotenzial pro Jahr"}
                    </div>
                    <div className="text-3xl sm:text-4xl font-bold text-emerald-400 my-1">
                      bis CHF {maxSavings.toLocaleString("de-CH")}
                    </div>
                    <div className="text-xs text-emerald-400 mt-1">
                      {uniqueInsurerCount} Versicherer verglichen
                      {currentPremiumNum > 0 && (
                        <> • aktuell CHF {currentPremiumNum.toFixed(0)}/Mt.</>
                      )}
                    </div>
                  </div>
                )}

                {groupedResults.length === 0 && !premiumLoading && (
                  <div className="text-center py-10">
                    <p className="text-white/50 text-lg">Keine Ergebnisse gefunden.</p>
                    <p className="text-white/40 text-sm mt-2">
                      Bitte prüfe deine Angaben oder versuche einen anderen Filter.
                    </p>
                  </div>
                )}

                {groupedResults.length > 0 && (
                  <>
                    {/* Filters */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-white/60">{groupedResults.length} Versicherer</span>
                        <button
                          onClick={() => { setShowResults(false); setStep(2); }}
                          className="text-xs sm:text-sm text-blue-400 font-medium hover:underline"
                        >
                          ✏️ Angaben ändern
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={modelFilter}
                          onChange={(e) => { setModelFilter(e.target.value); setExpandedInsurer(null); }}
                          className="select-field !w-auto text-sm !py-2 !px-3 !pr-8"
                        >
                          <option value="all">Alle Modelle</option>
                          <option value="standard">Standard</option>
                          <option value="hausarzt">Hausarzt</option>
                          <option value="hmo">HMO</option>
                          <option value="telmed">Telmed</option>
                        </select>

                        <select
                          value={sortOrder}
                          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                          className="select-field !w-auto text-sm !py-2 !px-3 !pr-8"
                        >
                          <option value="asc">Günstigste zuerst</option>
                          <option value="desc">Teuerste zuerst</option>
                        </select>
                      </div>
                    </div>

                    {/* Grouped insurer results */}
                    <div className="space-y-2">
                      {groupedResults.map((group, i) => {
                        const isExpanded = expandedInsurer === group.insurerId;
                        const isFirst = i === 0 && sortOrder === "asc";
                        const isCurrentInsurer = formState.currentInsurer && formState.currentInsurer !== "keine" && group.insurerName === formState.currentInsurer;
                        const primaryPerson = group.persons[0];
                        const cheapestModel = primaryPerson?.cheapest.t || "";
                        const cheapestTariff = primaryPerson?.cheapest.tn || "";

                        return (
                          <div
                            key={group.insurerId}
                            className={`rounded-xl border transition-all ${
                              isFirst ? "ring-2 ring-emerald-400 bg-emerald-500/10 border-emerald-500/25"
                              : isCurrentInsurer ? "ring-2 ring-blue-400/60 bg-blue-500/5 border-blue-500/20"
                              : "border-white/[0.08] bg-white/[0.03]"
                            }`}
                            style={{ animation: `slideUp 0.3s ease-out ${i * 0.03}s both` }}
                          >
                            {/* Main row */}
                            <div className="p-4">
                              {/* Top: Logo + Name + Price */}
                              <div className="flex items-start gap-3">
                                {/* Logo */}
                                {(() => {
                                  const logoUrl = getInsurerLogoUrl(group.insurerName);
                                  const colors = INSURER_COLORS[group.insurerName] || { bg: "#64748b", text: "#fff" };
                                  const initials = getInsurerInitials(group.insurerName);

                                  if (logoUrl) {
                                    return (
                                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden bg-white p-1">
                                        <img
                                          src={logoUrl}
                                          alt={group.insurerName}
                                          className="w-full h-full object-contain"
                                        />
                                      </div>
                                    );
                                  }

                                  return (
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                      style={{ backgroundColor: colors.bg }}
                                    >
                                      <span className="text-xs font-bold" style={{ color: colors.text }}>
                                        {initials}
                                      </span>
                                    </div>
                                  );
                                })()}

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-semibold text-white">{group.insurerName}</span>
                                    {isFirst && <span className="savings-badge text-xs">✓ Günstigste</span>}
                                    {isCurrentInsurer && <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium whitespace-nowrap">Deine Kasse</span>}
                                  </div>
                                  {!isMultiPerson && (
                                    <div className="text-xs text-white/50 mt-0.5 truncate">
                                      {MODEL_LABELS[cheapestModel] || cheapestModel} – {cheapestTariff}
                                    </div>
                                  )}
                                  {isMultiPerson && (
                                    <div className="text-xs text-white/50 mt-0.5 truncate">
                                      {group.persons.map((pt) => `${pt.personLabel}: CHF ${(pt.cheapest.p - VERGUETUNG_MONTHLY_PER_PERSON).toFixed(0)}`).join(" · ")}
                                    </div>
                                  )}
                                </div>

                                {/* Price - always top right */}
                                <div className="text-right shrink-0">
                                  <div className="text-lg sm:text-xl font-bold">
                                    <span className="text-xs sm:text-sm font-normal text-white/40">CHF </span>
                                    {group.totalMonthly.toFixed(2)}
                                  </div>
                                  <div className="text-[10px] sm:text-xs text-white/40">
                                    {isMultiPerson ? "Total/Monat" : "pro Monat"}
                                  </div>
                                </div>
                              </div>

                              {/* Bottom: Savings + Actions */}
                              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
                                {/* Savings */}
                                {group.savings > 0 && sortOrder === "asc" ? (
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                                    </svg>
                                    <span className="text-xs font-semibold text-emerald-400 whitespace-nowrap">
                                      CHF {group.savings.toLocaleString("de-CH")} sparen
                                    </span>
                                  </div>
                                ) : <div />}

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setExpandedInsurer(isExpanded ? null : group.insurerId)}
                                    className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-white/40 hover:bg-white/[0.06] hover:text-white/60 transition-colors"
                                  >
                                    <span>{isExpanded ? "Weniger" : "Alle Tarife"}</span>
                                    <svg
                                      className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedInsurers((prev) =>
                                        prev.includes(group.insurerName)
                                          ? prev.filter((n) => n !== group.insurerName)
                                          : [...prev, group.insurerName]
                                      );
                                    }}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                      selectedInsurers.includes(group.insurerName)
                                        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                                        : "bg-white/[0.06] text-white/60 hover:bg-white/[0.1] border border-white/[0.08]"
                                    }`}
                                  >
                                    {selectedInsurers.includes(group.insurerName) ? (
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                      </svg>
                                    ) : (
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                      </svg>
                                    )}
                                    Offerte
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Expanded tariff details */}
                            {isExpanded && (
                              <div className="border-t border-white/[0.06] bg-white/[0.03] px-3 sm:px-4 py-3 animate-fade-in">
                                {group.persons.map((pt, pIdx) => (
                                  <div key={pt.personId}>
                                    {isMultiPerson && (
                                      <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 mt-2 first:mt-0">
                                        {pt.personLabel} ({AGE_LABELS[pt.ageGroup]})
                                      </div>
                                    )}
                                    <div className="space-y-1">
                                      {pt.allTariffs.map((tariff, tIdx) => (
                                        <div
                                          key={`${tariff.tn}-${tIdx}`}
                                          className={`flex items-center justify-between py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm gap-3 ${
                                            tariff === pt.cheapest ? "bg-emerald-500/10 text-emerald-400" : "text-white/60"
                                          }`}
                                        >
                                          <div className="min-w-0 overflow-hidden">
                                            <div className="font-medium truncate">{tariff.tn}</div>
                                            <div className="text-white/30 text-[10px] sm:text-xs">
                                              {MODEL_LABELS[tariff.t] || tariff.t}
                                            </div>
                                          </div>
                                          <span className="font-semibold tabular-nums whitespace-nowrap shrink-0">
                                            CHF {(tariff.p - VERGUETUNG_MONTHLY_PER_PERSON).toFixed(2)}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                    {pIdx < group.persons.length - 1 && (
                                      <div className="border-b border-white/[0.08] my-2" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* Floating selection bar */}
                {selectedInsurers.length > 0 && (
                  <div className="sticky bottom-4 mt-6 mx-auto max-w-lg z-20 animate-slide-up">
                    <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#0f1a3a]/95 backdrop-blur-xl border border-orange-500/30 shadow-2xl shadow-orange-500/10">
                      <div className="flex items-center gap-2 min-w-0 pl-1">
                        <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-sm font-bold text-orange-400 shrink-0">
                          {selectedInsurers.length}
                        </div>
                        <span className="text-sm text-white/70 truncate">
                          {selectedInsurers.length === 1 ? "Offerte ausgewählt" : "Offerten ausgewählt"}
                        </span>
                      </div>
                      <button
                        onClick={() => setStep(4)}
                        className="btn-accent px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap shrink-0 flex items-center gap-1.5"
                      >
                        Weiter
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Fallback if no selection */}
                {selectedInsurers.length === 0 && (
                  <div className="mt-6 text-center">
                    <p className="text-xs text-white/30">Wähle eine oder mehrere Krankenkassen für eine persönliche Offerte</p>
                  </div>
                )}
              </div>
            )}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 4: Zusatzversicherung                                     */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {step >= 4 && (
        <div ref={(el) => { sectionRefs.current[4] = el; }} className="card-elevated overflow-visible" style={{ scrollMarginTop: "5.5rem" }}>
          {/* Section header */}
          <div className="flex items-center gap-3 p-5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 bg-blue-500 text-white shadow-lg shadow-blue-500/30">
              4
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white/80">Zusatzversicherung</div>
            </div>
          </div>

          {step === 4 && (
            <div className="px-5 pb-6 sm:px-8 sm:pb-8 animate-slide-down">
              <>
                {/* Selected insurers summary */}
                {selectedInsurers.length > 0 && (
                  <div className="mb-6 p-4 rounded-xl bg-orange-500/5 border border-orange-500/15">
                    <div className="text-xs font-medium text-orange-400/80 uppercase tracking-wider mb-2">Offerte für</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedInsurers.map((name) => (
                        <span key={name} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-sm text-orange-300 font-medium">
                          {name}
                          <button
                            onClick={() => setSelectedInsurers((prev) => prev.filter((n) => n !== name))}
                            className="w-4 h-4 rounded-full hover:bg-orange-500/30 flex items-center justify-center transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Wähle, was zählt</h2>
                  <p className="text-white/40 text-sm">
                    Welche Zusatzleistungen sind dir wichtig? (optional)
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {EXTRA_OPTIONS.map((opt) => {
                    const isSelected = formState.extras.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setFormState((prev) => ({
                            ...prev,
                            extras: prev.extras.includes(opt.id)
                              ? prev.extras.filter((e) => e !== opt.id)
                              : [...prev.extras, opt.id],
                          }));
                        }}
                        className={`group relative flex flex-col items-start p-4 rounded-xl border transition-all text-left overflow-hidden ${
                          isSelected
                            ? "border-blue-500/50 bg-blue-500/10 shadow-lg shadow-blue-500/10"
                            : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.15]"
                        }`}
                      >
                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="absolute top-2.5 right-2.5">
                            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                            </div>
                          </div>
                        )}

                        {/* Icon with gradient bg */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${
                          isSelected
                            ? `bg-gradient-to-br ${opt.color} text-white`
                            : "bg-white/[0.06] text-white/50"
                        }`}>
                          {opt.icon}
                        </div>

                        {/* Label */}
                        <span className={`text-sm font-semibold leading-tight mb-1 ${
                          isSelected ? "text-white" : "text-white/70"
                        }`}>
                          {opt.label}
                        </span>

                        {/* Description */}
                        <span className="text-[11px] leading-snug text-white/30">
                          {opt.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected count */}
                {formState.extras.length > 0 && (
                  <div className="mt-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 font-medium">
                      {formState.extras.length} ausgewählt
                    </span>
                  </div>
                )}

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={async () => {
                      // Update existing lead with extras
                      if (leadId && formState.extras.length > 0) {
                        try {
                          console.log("[EXTRAS PATCH] leadId:", leadId, "extras:", formState.extras, "selectedInsurers:", selectedInsurers);
                          const res = await fetch("/api/leads", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              id: leadId,
                              extras: formState.extras,
                              selectedInsurers,
                            }),
                          });
                          const result = await res.json();
                          console.log("[EXTRAS PATCH] result:", result);
                        } catch (err) {
                          console.error("[EXTRAS PATCH] error:", err);
                        }
                      } else {
                        console.log("[EXTRAS PATCH] skipped — leadId:", leadId, "extras:", formState.extras);
                      }
                      setExtrasSubmitted(true);
                    }}
                    disabled={extrasSubmitted}
                    className="btn-accent px-10 py-3.5 rounded-xl text-base disabled:opacity-60"
                  >
                    {extrasSubmitted ? "✓ Gesendet" : "Offerte anfordern"}
                  </button>
                </div>

                {extrasSubmitted && (
                  <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-center animate-fade-in">
                    <div className="text-emerald-400 font-semibold mb-1">Vielen Dank!</div>
                    <p className="text-white/50 text-sm">
                      Deine Zusatzwünsche wurden übermittelt. Wir melden uns in Kürze mit einer persönlichen Offerte.
                    </p>
                  </div>
                )}
              </>
            </div>
          )}
        </div>
      )}

      </div>{/* end space-y-3 */}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* LEAD MODAL                                                        */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {showLeadModal && !leadSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0f1a3a] border border-white/[0.1] rounded-2xl shadow-2xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">

            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Dein Vergleich ist bereit!</h3>
              <p className="text-sm text-white/50 mt-1">
                Gib deine Kontaktdaten ein, um dein persönliches Ergebnis zu sehen und eine Offerte zu erhalten.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1">
                  Vor- und Nachname *
                </label>
                <input
                  type="text"
                  placeholder="Vor- und Nachname"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1">
                  E-Mail-Adresse *
                </label>
                <input
                  type="email"
                  placeholder="E-Mail-Adresse"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1">
                  Telefonnummer *
                </label>
                <div className="flex gap-2">
                  <select
                    value={leadCountryCode}
                    onChange={(e) => setLeadCountryCode(e.target.value)}
                    className="select-field !w-[5.5rem] !pr-7 !pl-2 text-sm text-center"
                  >
                    <option value="+41">🇨🇭 +41</option>
                    <option value="+49">🇩🇪 +49</option>
                    <option value="+43">🇦🇹 +43</option>
                    <option value="+39">🇮🇹 +39</option>
                    <option value="+33">🇫🇷 +33</option>
                    <option value="+423">🇱🇮 +423</option>
                  </select>
                  <input
                    type="tel"
                    placeholder="79 123 45 67"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={leadConsent}
                  onChange={(e) => setLeadConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-white/[0.12] text-blue-400 focus:ring-blue-500"
                />
                <span className="text-xs text-white/50 leading-relaxed">
                  <strong>Ich stimme zu,</strong> dass meine Daten verarbeitet und an geprüfte
                  Versicherungsanbieter weitergegeben werden, um eine persönliche Offerte
                  zu erhalten. Meine Daten werden vertraulich behandelt.{" "}
                  <a href="/datenschutz" className="text-blue-400 underline">Datenschutzerklärung</a>.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={leadNewsletter}
                  onChange={(e) => setLeadNewsletter(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-white/[0.12] text-blue-400 focus:ring-blue-500"
                />
                <span className="text-xs text-white/50 leading-relaxed">
                  Ja, ich möchte den Newsletter mit Spartipps, Fristen und einfachen
                  Erklärungen abonnieren.
                </span>
              </label>

              {leadError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
                  {leadError}
                </div>
              )}

              <button
                onClick={handleLeadSubmit}
                disabled={!leadConsent || !leadName || !leadEmail || !leadPhone || leadLoading}
                className="btn-accent w-full py-3.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed text-base"
              >
                {leadLoading ? "Wird gesendet..." : "Ergebnis anzeigen"}
              </button>

              <p className="text-[10px] text-white/30 text-center">
                Kostenlos und unverbindlich · Keine versteckten Kosten
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
