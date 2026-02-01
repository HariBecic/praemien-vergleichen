"use client";

import { useState, useRef, useMemo, useCallback, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface Person {
  id: string;
  gender: "m" | "f" | "k" | "";
  name: string;
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
  { id: "doctor", label: "Freie Arzt- und Spitalwahl", icon: "🏥" },
  { id: "complementary", label: "Komplementärmedizin", icon: "🌿" },
  { id: "comfort", label: "Komfort im Spital", icon: "🛏️" },
  { id: "transport", label: "Transport und Rettung im Ausland", icon: "🚁" },
  { id: "glasses", label: "Brillen und Kontaktlinsen", icon: "👓" },
  { id: "fitness", label: "Fitness und Prävention", icon: "💪" },
  { id: "dental", label: "Zahnversicherung", icon: "🦷" },
  { id: "life", label: "Lebensversicherung / Tod und Invalidität", icon: "🛡️" },
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

const INSURER_DOMAINS: Record<string, string> = {
  "Agrisano": "agrisano.ch",
  "Aquilana": "aquilana.ch",
  "Assura": "assura.ch",
  "Atupri": "atupri.ch",
  "Avenir": "groupemutuel.ch",
  "Birchmeier": "birchmeier-kk.ch",
  "CSS": "css.ch",
  "Concordia": "concordia.ch",
  "EGK": "egk.ch",
  "Galenos": "galenos.ch",
  "Helsana": "helsana.ch",
  "KPT": "kpt.ch",
  "Luzerner Hinterland": "luzernerhinderland.ch",
  "Mutuel": "groupemutuel.ch",
  "Philos": "groupemutuel.ch",
  "SLKK": "slkk.ch",
  "SWICA": "swica.ch",
  "Sanitas": "sanitas.com",
  "Steffisburg": "kksteffisburg.ch",
  "Sumiswalder": "sumiswalder.ch",
  "Sympany": "sympany.ch",
  "Visana": "visana.ch",
  "Wädenswil": "kkw.ch",
  "rhenusana": "rhenusana.ch",
  "sana24": "sana24.ch",
  "vita surselva": "vitasurselva.ch",
  "ÖKK": "oekk.ch",
};

function getInsurerLogoUrl(insurerName: string): string | null {
  const domain = INSURER_DOMAINS[insurerName];
  if (!domain) return null;
  return `https://cdn.brandfetch.io/domain/${domain}?c=1idc9vLyOz1J1qurgu6`;
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
    birthYear: "",
    franchise: DEFAULT_FRANCHISE_ADULT,
    withAccident: true,
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

    groups.push({
      insurerId,
      insurerName,
      persons,
      totalMonthly: Math.round(totalMonthly * 100) / 100,
      totalYearly: Math.round(totalMonthly * 12 * 100) / 100,
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
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadConsent, setLeadConsent] = useState(false);
  const [leadNewsletter, setLeadNewsletter] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadError, setLeadError] = useState("");
  const [leadModalMode, setLeadModalMode] = useState<"save" | "offer">("offer");
  const [showCurrentInsurerField, setShowCurrentInsurerField] = useState(false);

  // PLZ/Ort combo search
  const [plzQuery, setPlzQuery] = useState("");
  const [plzSuggestions, setPlzSuggestions] = useState<{ plz: string; entry: PlzEntry }[]>([]);
  const [showPlzDropdown, setShowPlzDropdown] = useState(false);
  const plzSearchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Save modal auto-open timer
  const saveBannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Tooltips
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

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

        // Auto-reset franchise when age group changes
        if (updates.birthYear !== undefined) {
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
    setFormState((prev) => ({
      ...prev,
      persons: [...prev.persons, createPerson()],
    }));
  }, []);

  const removePerson = useCallback((id: string) => {
    setFormState((prev) => ({
      ...prev,
      persons: prev.persons.filter((p) => p.id !== id),
    }));
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
          personLabel: formState.persons.length > 1 ? `Person ${i + 1}` : "",
          ageGroup,
          franchise: person.franchise,
          withAccident: person.withAccident,
          entries,
        });
      }

      setPersonRawDataList(results);
      setExpandedInsurer(null);
      setShowResults(true);
    } catch {
      setPersonRawDataList([]);
      setShowResults(true);
    } finally {
      setPremiumLoading(false);
    }
  }, [formState, loadCantonPremiums]);

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
          (p) => p.birthYear !== "" && p.franchise > -1
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
      const person = formState.persons[0];
      const cheapest = groupedResults.length > 0
        ? [...groupedResults].sort((a, b) => a.totalMonthly - b.totalMonthly)[0]
        : null;

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadName,
          email: leadEmail,
          phone: leadPhone,
          plz: formState.plz,
          ort: formState.ort,
          canton: formState.canton,
          birthYear: person?.birthYear || "",
          ageGroup: person ? getAgeGroup(person.birthYear) : "ERW",
          franchise: person?.franchise || 0,
          model: modelFilter,
          currentInsurer: formState.currentInsurer,
          currentPremium: formState.currentPremium,
          cheapestInsurer: cheapest?.insurerName || "",
          cheapestPremium: cheapest?.totalMonthly || 0,
          extras: formState.extras,
          newsletter: leadNewsletter,
          calculationType: formState.calculationType,
          personsCount: formState.persons.length,
        }),
      });

      if (res.ok) {
        setLeadSubmitted(true);
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
      if (saveBannerTimerRef.current) clearTimeout(saveBannerTimerRef.current);
    };
  }, []);

  // ─── PLZ/Ort combo search ─────────────────────────────────────────────

  const handlePlzQueryChange = useCallback(
    async (query: string) => {
      setPlzQuery(query);
      setPlzError("");

      if (query.length < 2) {
        setPlzSuggestions([]);
        setShowPlzDropdown(false);
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

          setPlzSuggestions(results);
          setShowPlzDropdown(results.length > 0);
        } catch {
          setPlzSuggestions([]);
          setShowPlzDropdown(false);
        }
      }, 200);
    },
    [loadPlzData]
  );

  const handlePlzSuggestionSelect = useCallback(
    (plz: string, entry: PlzEntry) => {
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
    },
    [loadCantonPremiums]
  );

  // ─── Auto-open lead modal after 5s on results ─────────────────────

  useEffect(() => {
    if (showResults && !leadSubmitted && !showLeadModal) {
      saveBannerTimerRef.current = setTimeout(() => {
        setLeadModalMode("save");
        const firstName = formState.persons[0]?.name || "";
        if (firstName && !leadName) setLeadName(firstName);
        setShowLeadModal(true);
      }, 5000);
    }
    return () => {
      if (saveBannerTimerRef.current) clearTimeout(saveBannerTimerRef.current);
    };
  }, [showResults, leadSubmitted, showLeadModal]);

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════

  const STEP_LABELS = [
    "Situation & Wohnort",
    "Persönliche Angaben",
    "Grundversicherung",
    "Zusatzversicherung",
  ];

  const openLeadModal = (mode: "save" | "offer") => {
    setLeadModalMode(mode);
    const firstName = formState.persons[0]?.name || "";
    if (firstName && !leadName) setLeadName(firstName);
    setShowLeadModal(true);
  };

  const InfoTooltip = ({ id, text }: { id: string; text: string }) => (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setActiveTooltip(activeTooltip === id ? null : id); }}
        className="w-5 h-5 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-500 text-xs font-bold flex items-center justify-center ml-1 transition-colors"
      >
        i
      </button>
      {activeTooltip === id && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setActiveTooltip(null)} />
          <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-xl bg-stone-800 text-white text-xs leading-relaxed shadow-xl">
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-stone-800" />
          </div>
        </>
      )}
    </span>
  );

  return (
    <div className="max-w-3xl mx-auto">
      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* STEP INDICATOR (miavita-style connected line)                     */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="relative flex items-start justify-between mb-10 px-4">
        {/* Background line */}
        <div className="absolute top-5 left-[calc(12.5%)] right-[calc(12.5%)] h-0.5 bg-stone-200" />
        {/* Progress line */}
        <div
          className="absolute top-5 left-[calc(12.5%)] h-0.5 bg-[#0f4c5c] transition-all duration-500"
          style={{ width: `${Math.max(0, (step - 1) / 3) * 75}%` }}
        />
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          const isActive = step === n;
          const isCompleted = step > n;
          return (
            <div key={n} className="relative flex flex-col items-center z-10" style={{ width: "25%" }}>
              <button
                onClick={() => isCompleted && setStep(n)}
                disabled={!isCompleted}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all border-2 ${
                  isActive
                    ? "border-[#0f4c5c] bg-[#0f4c5c] text-white shadow-lg shadow-[#0f4c5c]/30"
                    : isCompleted
                    ? "border-[#0f4c5c] bg-[#0f4c5c] text-white cursor-pointer hover:bg-[#1a6b7a]"
                    : "border-stone-300 bg-white text-stone-400"
                }`}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  n
                )}
              </button>
              <span
                className={`text-xs mt-2 text-center leading-tight hidden sm:block ${
                  isActive ? "text-[#0f4c5c] font-semibold" : isCompleted ? "text-[#0f4c5c]" : "text-stone-400"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* MAIN CARD                                                         */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="card-elevated p-6 sm:p-8">
        {/* Loading overlay */}
        {premiumLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[#0f4c5c]/20 border-t-[#0f4c5c] rounded-full animate-spin mx-auto mb-4" />
              <p className="text-stone-600 font-medium">Prämien werden berechnet...</p>
            </div>
          </div>
        )}

        {/* ── STEP 1: Situation & Wohnort ──────────────────────────────── */}
        {step === 1 && (
          <div className="animate-fade-in">
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
                      ? "border-[#0f4c5c] bg-[#0f4c5c]/5 text-[#0f4c5c]"
                      : "border-stone-200 hover:border-stone-300 text-stone-500"
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
              <p className="text-sm text-stone-500 mb-3">Die Prämien ändern sich je nach Region</p>
              <div className="relative">
                <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">PLZ / Ort *</label>
                <input
                  type="text"
                  placeholder="PLZ oder Ort eingeben"
                  value={plzQuery}
                  onChange={(e) => handlePlzQueryChange(e.target.value)}
                  onFocus={() => plzSuggestions.length > 0 && setShowPlzDropdown(true)}
                  className={`input-field text-lg ${plzError ? "!border-red-400" : ""}`}
                />
                {plzLoading && (
                  <span className="absolute right-4 bottom-3">
                    <div className="w-4 h-4 border-2 border-stone-300 border-t-[#0f4c5c] rounded-full animate-spin" />
                  </span>
                )}
                {!plzLoading && formState.canton && (
                  <span className="absolute right-4 bottom-3 text-sm text-emerald-500">✓</span>
                )}

                {/* Dropdown */}
                {showPlzDropdown && plzSuggestions.length > 0 && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowPlzDropdown(false)} />
                    <div className="absolute z-40 top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                      {plzSuggestions.map((s, idx) => (
                        <button
                          key={`${s.plz}-${s.entry.o}-${idx}`}
                          onClick={() => handlePlzSuggestionSelect(s.plz, s.entry)}
                          className="w-full px-4 py-3 text-left text-sm hover:bg-stone-50 flex items-center justify-between border-b border-stone-50 last:border-0 transition-colors"
                        >
                          <span>
                            <span className="font-medium">{s.plz}</span>{" "}
                            <span className="text-stone-600">{s.entry.o}</span>
                          </span>
                          <span className="text-xs text-stone-400 ml-2">{s.entry.c}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {plzError && <p className="text-red-500 text-sm mt-2">{plzError}</p>}

              {formState.canton && (
                <p className="text-xs text-stone-400 mt-2">
                  Prämienregion: {formState.canton}-{formState.region} • {formState.ort}
                </p>
              )}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setStep(2)}
                disabled={!canProceed(1)}
                className="btn-accent px-10 py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Weiter
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Persönliche Angaben ──────────────────────────────── */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-center mb-6">Persönliche Angaben ergänzen</h2>

            <div className="space-y-6">
              {formState.persons.map((person, idx) => {
                const ageGroup = getAgeGroup(person.birthYear);
                const franchises = getFranchisesForAge(ageGroup);
                const isUnborn = formState.calculationType === "unborn" && idx === 0;

                return (
                  <div key={person.id} className="p-5 rounded-xl bg-stone-50 border border-stone-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-stone-700">
                        {isUnborn ? "Ungeborenes Kind" : `Person ${idx + 1}`}
                        {person.birthYear && (
                          <span className="text-xs font-normal text-stone-400 ml-2">
                            ({AGE_LABELS[ageGroup]})
                          </span>
                        )}
                      </h3>
                      {idx > 0 && (
                        <button
                          onClick={() => removePerson(person.id)}
                          className="text-sm text-red-500 hover:text-red-700"
                        >
                          Entfernen
                        </button>
                      )}
                    </div>

                    {/* Gender: 3 options */}
                    <div className="mb-4">
                      <label className="block text-xs text-stone-500 mb-2">Geschlecht</label>
                      <div className="flex gap-2">
                        {(
                          [
                            { value: "m" as const, label: "Männlich", icon: (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                              </svg>
                            )},
                            { value: "f" as const, label: "Weiblich", icon: (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                              </svg>
                            )},
                            { value: "k" as const, label: "Kind", icon: (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                              </svg>
                            )},
                          ]
                        ).map((g) => (
                          <button
                            key={g.value}
                            onClick={() => updatePerson(person.id, { gender: g.value })}
                            className={`flex items-center gap-2 flex-1 py-2.5 px-3 rounded-lg text-sm font-medium border transition-all ${
                              person.gender === g.value
                                ? "border-[#0f4c5c] bg-[#0f4c5c]/5 text-[#0f4c5c]"
                                : "border-stone-200 text-stone-500 hover:border-stone-300"
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
                        <label className="block text-xs text-stone-500 mb-1">Vor- und Nachname *</label>
                        <input
                          type="text"
                          placeholder={isUnborn ? "Baby" : "Vor- und Nachname"}
                          value={person.name}
                          onChange={(e) => updatePerson(person.id, { name: e.target.value })}
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-stone-500 mb-1">Jahrgang *</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={4}
                          placeholder="z.B. 1990"
                          value={person.birthYear}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                            updatePerson(person.id, { birthYear: val });
                          }}
                          className={`input-field ${
                            person.birthYear.length === 4 && (parseInt(person.birthYear) < 1920 || parseInt(person.birthYear) > new Date().getFullYear())
                              ? "!border-red-400"
                              : ""
                          }`}
                        />
                        {person.birthYear.length === 4 && (
                          <p className="text-xs text-stone-400 mt-1">
                            {AGE_LABELS[getAgeGroup(person.birthYear)]} ({new Date().getFullYear() - parseInt(person.birthYear)} J.)
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs text-stone-500 mb-1">Franchise *</label>
                        <select
                          value={franchises.includes(person.franchise) ? person.franchise : ""}
                          onChange={(e) => updatePerson(person.id, { franchise: parseInt(e.target.value) })}
                          className="select-field"
                        >
                          <option value="">Wählen</option>
                          {franchises.map((f) => (
                            <option key={f} value={f}>
                              CHF {f.toLocaleString("de-CH")}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Toggles with info tooltips */}
                    <div className="flex flex-wrap gap-6 mt-4">
                      <label className="flex items-center gap-2 cursor-pointer text-sm">
                        <div
                          className={`relative w-10 h-5 rounded-full transition-colors ${person.withAccident ? "bg-[#0f4c5c]" : "bg-stone-300"}`}
                          onClick={() => updatePerson(person.id, { withAccident: !person.withAccident })}
                        >
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${person.withAccident ? "translate-x-5" : "translate-x-0.5"}`} />
                        </div>
                        <span>Unfalldeckung einschliessen</span>
                        <InfoTooltip id={`accident-${person.id}`} text="Wähle dies, wenn du nicht über deinen Arbeitgeber gegen Unfall versichert bist. Angestellte mit 8+ Stunden/Woche sind in der Regel über den Arbeitgeber versichert." />
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-sm">
                        <div
                          className={`relative w-10 h-5 rounded-full transition-colors ${person.isNewToSwitzerland ? "bg-[#0f4c5c]" : "bg-stone-300"}`}
                          onClick={() => updatePerson(person.id, { isNewToSwitzerland: !person.isNewToSwitzerland })}
                        >
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${person.isNewToSwitzerland ? "translate-x-5" : "translate-x-0.5"}`} />
                        </div>
                        <span>Neu in der Schweiz</span>
                        <InfoTooltip id={`new-ch-${person.id}`} text="Du bist neu in der Schweiz und hast dich innerhalb der letzten 3 Monate angemeldet? Dann hast du 3 Monate Zeit, eine Krankenkasse zu wählen." />
                      </label>
                    </div>

                    {person.isNewToSwitzerland && (
                      <div className="mt-3">
                        <label className="block text-xs text-stone-500 mb-1">Einreisedatum</label>
                        <input
                          type="date"
                          value={person.entryDate}
                          onChange={(e) => updatePerson(person.id, { entryDate: e.target.value })}
                          className="input-field max-w-xs"
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
                className="text-sm font-medium text-[#0f4c5c] hover:text-[#1a6b7a] flex items-center gap-2"
              >
                <span className="w-6 h-6 rounded-full bg-[#0f4c5c]/10 flex items-center justify-center text-[#0f4c5c]">+</span>
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
                  className="text-sm font-medium text-[#0f4c5c] hover:text-[#1a6b7a] flex items-center gap-2"
                >
                  <span className="w-6 h-6 rounded-full bg-[#0f4c5c]/10 flex items-center justify-center text-[#0f4c5c]">+</span>
                  Ungeborenes Kind hinzufügen
                </button>
              )}
            </div>

            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(1)} className="text-sm font-medium text-stone-500 hover:text-stone-700 px-4 py-2">
                Zurück
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canProceed(2)}
                className="btn-accent px-10 py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Weiter
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Grundversicherung (Preferences + Inline Results) ─ */}
        {step === 3 && (
          <div className="animate-fade-in">
            {!showResults ? (
              <>
                <h2 className="text-xl font-bold text-center mb-2">Stell deine Präferenzen ein</h2>
                <p className="text-center text-stone-500 text-sm mb-6">
                  Personalisiere deine Ergebnisse mit unseren Empfehlungen und Angeboten.
                </p>

                <div className="max-w-md mx-auto space-y-6">
                  {/* Current insurer (collapsible) */}
                  <div>
                    {!showCurrentInsurerField ? (
                      <button
                        onClick={() => setShowCurrentInsurerField(true)}
                        className="flex items-center gap-2 text-sm font-medium text-[#0f4c5c] hover:text-[#1a6b7a]"
                      >
                        <span className="w-6 h-6 rounded-full bg-[#0f4c5c]/10 flex items-center justify-center text-[#0f4c5c]">+</span>
                        Aktuelle Versicherung hinzufügen
                      </button>
                    ) : (
                      <div className="space-y-3 p-4 rounded-xl bg-stone-50 border border-stone-200">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-stone-700">Aktuelle Krankenkasse</label>
                          <button
                            onClick={() => {
                              setShowCurrentInsurerField(false);
                              setFormState((prev) => ({ ...prev, currentInsurer: "", currentPremium: "" }));
                            }}
                            className="text-xs text-stone-400 hover:text-stone-600"
                          >
                            Entfernen
                          </button>
                        </div>
                        <select
                          value={formState.currentInsurer}
                          onChange={(e) => setFormState((prev) => ({ ...prev, currentInsurer: e.target.value }))}
                          className="select-field"
                        >
                          <option value="">Wählen...</option>
                          {CURRENT_INSURERS.map((ins) => (
                            <option key={ins} value={ins}>{ins}</option>
                          ))}
                        </select>
                        {formState.currentInsurer && (
                          <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                              Aktuelle Monatsprämie CHF {isMultiPerson ? "(Total)" : ""}
                            </label>
                            <input
                              type="number"
                              placeholder={isMultiPerson ? "z.B. 900" : "z.B. 450"}
                              value={formState.currentPremium}
                              onChange={(e) => setFormState((prev) => ({ ...prev, currentPremium: e.target.value }))}
                              className="input-field"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Preference buttons */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-3">
                      Wähle deine Präferenz:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          { value: "cheapest", label: "Günstigste" },
                          { value: "recommended", label: "Empfehlung" },
                          { value: "offers", label: "Angebote" },
                        ] as const
                      ).map((pref) => (
                        <button
                          key={pref.value}
                          onClick={() => setFormState((prev) => ({ ...prev, preference: pref.value }))}
                          className={`p-3 rounded-xl text-center text-sm font-medium border-2 transition-all ${
                            formState.preference === pref.value
                              ? "border-[#0f4c5c] bg-[#0f4c5c] text-white"
                              : "border-stone-200 hover:border-stone-300 text-stone-600"
                          }`}
                        >
                          {pref.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button onClick={() => setStep(2)} className="text-sm font-medium text-stone-500 hover:text-stone-700 px-4 py-2">
                    Zurück
                  </button>
                  <button
                    onClick={calculateResults}
                    disabled={premiumLoading}
                    className="btn-accent px-8 py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {premiumLoading && (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    Ergebnis anzeigen
                  </button>
                </div>
              </>
            ) : (
              /* ── INLINE RESULTS ── */
              <>
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
                      <p className="text-center text-stone-500 mb-1">{summaryParts.join(" • ")}</p>
                      <p className="text-center text-xs text-stone-400 mb-6">
                        Offizielle Daten: Bundesamt für Gesundheit (BAG)
                      </p>
                    </>
                  );
                })()}

                {/* Multi-person summary */}
                {isMultiPerson && (
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {personRawDataList.map((pd, i) => (
                      <span key={pd.personId} className="text-xs bg-stone-100 text-stone-600 px-3 py-1 rounded-full">
                        Person {i + 1}: {AGE_LABELS[pd.ageGroup]} • Fr. {formState.persons[i]?.franchise}
                      </span>
                    ))}
                  </div>
                )}

                {/* Savings highlight */}
                {maxSavings > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-6 text-center">
                    <div className="text-sm font-medium text-emerald-700">
                      {currentPremiumNum > 0 ? "Deine mögliche Ersparnis pro Jahr" : "Sparpotenzial pro Jahr"}
                    </div>
                    <div className="text-3xl sm:text-4xl font-bold text-emerald-800 my-1">
                      bis CHF {maxSavings.toLocaleString("de-CH")}
                    </div>
                    <div className="text-xs text-emerald-600 mt-1">
                      {uniqueInsurerCount} Versicherer verglichen
                      {currentPremiumNum > 0 && (
                        <> • aktuell CHF {currentPremiumNum.toFixed(0)}/Mt.</>
                      )}
                    </div>
                  </div>
                )}

                {groupedResults.length === 0 && !premiumLoading && (
                  <div className="text-center py-10">
                    <p className="text-stone-500 text-lg">Keine Ergebnisse gefunden.</p>
                    <p className="text-stone-400 text-sm mt-2">
                      Bitte prüfe deine Angaben oder versuche einen anderen Filter.
                    </p>
                  </div>
                )}

                {groupedResults.length > 0 && (
                  <>
                    {/* Filters */}
                    <div className="flex flex-wrap gap-3 mb-6">
                      <select
                        value={modelFilter}
                        onChange={(e) => { setModelFilter(e.target.value); setExpandedInsurer(null); }}
                        className="select-field !w-auto"
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
                        className="select-field !w-auto"
                      >
                        <option value="asc">Günstigste zuerst</option>
                        <option value="desc">Teuerste zuerst</option>
                      </select>

                      <button
                        onClick={() => setShowResults(false)}
                        className="ml-auto text-sm text-[#0f4c5c] font-medium hover:underline"
                      >
                        Angaben ändern
                      </button>
                    </div>

                    {/* Grouped insurer results */}
                    <div className="space-y-2">
                      {groupedResults.map((group, i) => {
                        const isExpanded = expandedInsurer === group.insurerId;
                        const isFirst = i === 0 && sortOrder === "asc";
                        const primaryPerson = group.persons[0];
                        const cheapestModel = primaryPerson?.cheapest.t || "";
                        const cheapestTariff = primaryPerson?.cheapest.tn || "";

                        return (
                          <div
                            key={group.insurerId}
                            className={`rounded-xl border overflow-hidden transition-all ${
                              isFirst ? "ring-2 ring-emerald-400 bg-emerald-50/30 border-emerald-200" : "border-stone-200 bg-white"
                            }`}
                            style={{ animation: `slideUp 0.3s ease-out ${i * 0.03}s both` }}
                          >
                            {/* Main row */}
                            <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                              {/* Logo */}
                              {(() => {
                                const logoUrl = getInsurerLogoUrl(group.insurerName);
                                return logoUrl ? (
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden bg-white border ${
                                    isFirst ? "border-emerald-200" : "border-stone-200"
                                  }`}>
                                    <img
                                      src={logoUrl}
                                      alt={group.insurerName}
                                      className="w-8 h-8 object-contain"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = "none";
                                        const parent = target.parentElement;
                                        if (parent) {
                                          parent.textContent = group.insurerName.slice(0, 2).toUpperCase();
                                          parent.className = `w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                            isFirst ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-500"
                                          }`;
                                        }
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                    isFirst ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-500"
                                  }`}>
                                    {group.insurerName.slice(0, 2).toUpperCase()}
                                  </div>
                                );
                              })()}

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-semibold text-stone-900">{group.insurerName}</span>
                                  {isFirst && <span className="savings-badge text-xs">✓ Günstigste</span>}
                                </div>
                                {!isMultiPerson && (
                                  <div className="text-sm text-stone-500">
                                    {MODEL_LABELS[cheapestModel] || cheapestModel} – {cheapestTariff}
                                  </div>
                                )}
                                {isMultiPerson && (
                                  <div className="text-sm text-stone-500">
                                    {group.persons.map((pt) => `${pt.personLabel}: CHF ${pt.cheapest.p.toFixed(0)}`).join(" + ")}
                                  </div>
                                )}
                              </div>

                              {/* Savings */}
                              {group.savings > 0 && sortOrder === "asc" && (
                                <div className="text-right hidden sm:block">
                                  <div className="text-xs text-emerald-600 font-medium">Ersparnis/Jahr</div>
                                  <div className="text-sm font-semibold text-emerald-700">
                                    CHF {group.savings.toLocaleString("de-CH")}
                                  </div>
                                </div>
                              )}

                              {/* Price */}
                              <div className="text-right">
                                <div className="text-xl font-bold">
                                  <span className="text-sm font-normal text-stone-400">CHF </span>
                                  {group.totalMonthly.toFixed(2)}
                                </div>
                                <div className="text-xs text-stone-400">
                                  {isMultiPerson ? "Total/Monat" : "pro Monat"}
                                </div>
                              </div>

                              {/* Expand + Offerte → goes to Step 4 */}
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                  onClick={() => setExpandedInsurer(isExpanded ? null : group.insurerId)}
                                  className="p-2 rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors"
                                  title="Alle Tarife anzeigen"
                                >
                                  <svg
                                    className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => setStep(4)}
                                  className="px-4 py-2 rounded-lg text-sm font-medium bg-[#e36414] text-white hover:bg-[#fb8b24] transition-colors"
                                >
                                  Offerte
                                </button>
                              </div>
                            </div>

                            {/* Expanded tariff details */}
                            {isExpanded && (
                              <div className="border-t border-stone-100 bg-stone-50/50 px-4 py-3 animate-fade-in">
                                {group.persons.map((pt, pIdx) => (
                                  <div key={pt.personId}>
                                    {isMultiPerson && (
                                      <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2 mt-2 first:mt-0">
                                        {pt.personLabel} ({AGE_LABELS[pt.ageGroup]})
                                      </div>
                                    )}
                                    <div className="space-y-1">
                                      {pt.allTariffs.map((tariff, tIdx) => (
                                        <div
                                          key={`${tariff.tn}-${tIdx}`}
                                          className={`flex items-center justify-between py-1.5 px-3 rounded-lg text-sm ${
                                            tariff === pt.cheapest ? "bg-emerald-50 text-emerald-800" : "text-stone-600"
                                          }`}
                                        >
                                          <div>
                                            <span className="font-medium">{tariff.tn}</span>
                                            <span className="text-stone-400 ml-2">
                                              {MODEL_LABELS[tariff.t] || tariff.t}
                                            </span>
                                          </div>
                                          <span className="font-semibold tabular-nums">
                                            CHF {tariff.p.toFixed(2)}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                    {pIdx < group.persons.length - 1 && (
                                      <div className="border-b border-stone-200 my-2" />
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

                {/* Weiter to Step 4 */}
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => setStep(4)}
                    className="btn-accent px-10 py-3 rounded-xl"
                  >
                    Weiter zu Zusatzversicherung
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── STEP 4: Zusatzversicherung + Lead Form ──────────────────── */}
        {step === 4 && (
          <div className="animate-fade-in">
            {!showLeadModal || leadSubmitted ? (
              <>
                <h2 className="text-xl font-bold text-center mb-2">Wähle, was zählt</h2>
                <p className="text-center text-stone-500 text-sm mb-8">
                  Welche Zusatzleistungen sind dir wichtig?
                </p>

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
                        className={`flex flex-col items-start gap-3 p-4 rounded-xl border-2 transition-all text-left min-h-[120px] ${
                          isSelected
                            ? "border-[#0f4c5c] bg-[#0f4c5c]/5"
                            : "border-stone-200 hover:border-stone-300 bg-white"
                        }`}
                      >
                        <span className="text-2xl">{opt.icon}</span>
                        <span className={`text-sm font-medium leading-tight ${isSelected ? "text-[#0f4c5c]" : "text-stone-700"}`}>
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-10 flex justify-between items-center">
                  <button onClick={() => setStep(3)} className="text-sm font-medium text-stone-500 hover:text-stone-700 px-4 py-2">
                    Zurück
                  </button>
                  <button
                    onClick={() => openLeadModal("offer")}
                    className="btn-accent px-10 py-3.5 rounded-xl text-base"
                  >
                    Jetzt Wechseln
                  </button>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* LEAD MODAL                                                        */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {showLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowLeadModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {!leadSubmitted ? (
              <>
                <h3 className="text-xl font-bold mb-1">
                  {leadModalMode === "save"
                    ? "Speichere deinen Fortschritt"
                    : "Jetzt Vergleichsofferte erhalten"}
                </h3>
                <p className="text-sm text-stone-500 mb-5">
                  {leadModalMode === "save"
                    ? "Du erhältst eine E-Mail mit einem Link, damit du deine Ergebnisse beim nächsten Besuch einfach abrufen kannst."
                    : "Erhalte eine kostenlose und unverbindliche Offerte basierend auf deinen Angaben."}
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">
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
                    <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">
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
                    <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">
                      Telefonnummer *
                    </label>
                    <div className="flex gap-2">
                      <span className="input-field !w-20 flex items-center justify-center text-sm text-stone-500">
                        🇨🇭 +41
                      </span>
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
                      className="mt-0.5 w-4 h-4 rounded border-stone-300 text-[#0f4c5c] focus:ring-[#0f4c5c]"
                    />
                    <span className="text-xs text-stone-500 leading-relaxed">
                      <strong>Ich stimme zu,</strong> dass meine Daten verarbeitet und an geprüfte
                      Versicherungsberater weitergegeben werden, um eine persönliche Offerte
                      zu erhalten. Meine Daten werden vertraulich behandelt.{" "}
                      <a href="/datenschutz" className="text-[#0f4c5c] underline">Datenschutzerklärung</a>.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={leadNewsletter}
                      onChange={(e) => setLeadNewsletter(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-stone-300 text-[#0f4c5c] focus:ring-[#0f4c5c]"
                    />
                    <span className="text-xs text-stone-500 leading-relaxed">
                      Ja, ich möchte den Newsletter mit Spartipps, Fristen und einfachen
                      Erklärungen abonnieren.
                    </span>
                  </label>

                  {leadError && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                      {leadError}
                    </div>
                  )}

                  <button
                    onClick={handleLeadSubmit}
                    disabled={!leadConsent || !leadName || !leadEmail || !leadPhone || leadLoading}
                    className="btn-accent w-full py-3.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {leadLoading
                      ? "Wird gesendet..."
                      : leadModalMode === "save"
                      ? "Jetzt speichern"
                      : "Offerte anfordern"}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Vielen Dank!</h3>
                <p className="text-stone-500 text-sm">
                  {leadModalMode === "save"
                    ? "Dein Fortschritt wurde gespeichert. Wir melden uns bei dir."
                    : "Wir haben deine Anfrage erhalten und melden uns in Kürze bei dir."}
                </p>
                <p className="text-stone-400 text-xs mt-3">
                  Bei Fragen: <strong className="text-stone-600">info@praemien-vergleichen.ch</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
