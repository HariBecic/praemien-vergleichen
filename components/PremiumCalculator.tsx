"use client";

import { useState, useRef, useMemo, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Person {
  id: string;
  gender: "m" | "f" | "";
  name: string;
  birthdate: string;
  franchise: number;
  withAccident: boolean;
  isNewToSwitzerland: boolean;
  entryDate: string;
}

interface FormState {
  // Step 1
  calculationType: "single" | "couple" | "family" | "unborn";
  plz: string;
  ort: string;
  canton: string;
  region: number;

  // Step 2
  persons: Person[];

  // Step 3
  currentInsurer: string;
  currentPremium: string;
  preference: "cheapest" | "recommended" | "offers";

  // Step 4 (Zusatzversicherung interests)
  extras: string[];
}

interface PlzEntry {
  c: string; // canton
  r: number; // region
  o: string; // ort
}

interface PremiumRawEntry {
  id: number;
  n: string;  // insurer name
  t: string;  // tariff type (standard/hausarzt/hmo/telmed)
  tn: string; // tariff name
  p: number;  // monthly premium
}

interface Result {
  insurer: string;
  insurerNr: string;
  model: string;
  modelName: string;
  monthlyPremium: number;
  yearlyPremium: number;
  savings: number;
}

// Canton premium data: { "1": { "ERW-OHN-2500": [...entries] } }
type CantonData = Record<string, Record<string, PremiumRawEntry[]>>;

// PLZ data: { "8001": [{ c, r, o }] }
type PlzData = Record<string, PlzEntry[]>;

// ─── Constants ───────────────────────────────────────────────────────────────

const FRANCHISES_ADULT = [300, 500, 1000, 1500, 2000, 2500];
const FRANCHISES_CHILD = [0, 100, 200, 300, 400, 500, 600];

const CURRENT_INSURERS = [
  "CSS", "Sanitas", "SWICA", "Helsana", "Visana", "Concordia",
  "Assura", "Groupe Mutuel", "KPT", "Atupri", "ÖKK", "Sympany", "Andere",
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getAgeGroup(birthdate: string): "KIN" | "JUG" | "ERW" {
  if (!birthdate) return "ERW";
  const birth = new Date(birthdate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  if (age < 19) return "KIN";
  if (age < 26) return "JUG";
  return "ERW";
}

function getFranchisesForAge(ageGroup: string): number[] {
  return ageGroup === "KIN" ? FRANCHISES_CHILD : FRANCHISES_ADULT;
}

function createPerson(id?: string): Person {
  return {
    id: id || `p-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    gender: "",
    name: "",
    birthdate: "",
    franchise: 2500,
    withAccident: true,
    isNewToSwitzerland: false,
    entryDate: "",
  };
}

function buildLookupKey(
  ageGroup: string,
  withAccident: boolean,
  franchise: number
): string {
  return `${ageGroup}-${withAccident ? "MIT" : "OHN"}-${franchise}`;
}

function mapToResults(
  entries: PremiumRawEntry[],
  modelFilter: string
): Result[] {
  let filtered = entries;
  if (modelFilter !== "all") {
    filtered = entries.filter((e) => e.t === modelFilter);
  }

  const results: Result[] = filtered.map((e) => ({
    insurer: e.n,
    insurerNr: String(e.id),
    model: e.t,
    modelName: e.tn,
    monthlyPremium: e.p,
    yearlyPremium: Math.round(e.p * 12 * 100) / 100,
    savings: 0,
  }));

  results.sort((a, b) => a.monthlyPremium - b.monthlyPremium);

  if (results.length > 0) {
    const max = results[results.length - 1].monthlyPremium;
    results.forEach((r) => {
      r.savings = Math.round((max - r.monthlyPremium) * 12);
    });
  }

  return results;
}

// ─── Main Component ──────────────────────────────────────────────────────────

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

  // Data loading
  const plzDataRef = useRef<PlzData | null>(null);
  const premiumCacheRef = useRef<Record<string, CantonData>>({});
  const [plzLoading, setPlzLoading] = useState(false);
  const [premiumLoading, setPremiumLoading] = useState(false);

  // PLZ lookup state
  const [plzEntries, setPlzEntries] = useState<PlzEntry[]>([]);
  const [plzError, setPlzError] = useState("");
  const [showPlzSelect, setShowPlzSelect] = useState(false);

  // Results state
  const [allResults, setAllResults] = useState<Result[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [modelFilter, setModelFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [rawEntries, setRawEntries] = useState<PremiumRawEntry[]>([]);

  // Lead form
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadConsent, setLeadConsent] = useState(false);
  const [leadNewsletter, setLeadNewsletter] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);

  // ─── Load PLZ Data ──────────────────────────────────────────────────────
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

  // ─── Load Premium Data for Canton ───────────────────────────────────────
  const loadCantonPremiums = useCallback(
    async (canton: string): Promise<CantonData> => {
      if (premiumCacheRef.current[canton]) {
        return premiumCacheRef.current[canton];
      }
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
    },
    []
  );

  // ─── PLZ Lookup ─────────────────────────────────────────────────────────
  const handlePlzChange = useCallback(
    async (plz: string) => {
      setFormState((prev) => ({ ...prev, plz }));
      setPlzError("");
      setShowPlzSelect(false);

      if (plz.length < 4) {
        setFormState((prev) => ({ ...prev, plz, canton: "", ort: "", region: 0 }));
        setPlzEntries([]);
        return;
      }

      if (plz.length === 4) {
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

          if (entries.length === 1) {
            setFormState((prev) => ({
              ...prev,
              canton: entries[0].c,
              ort: entries[0].o,
              region: entries[0].r,
            }));
          } else {
            setFormState((prev) => ({
              ...prev,
              canton: entries[0].c,
              ort: entries[0].o,
              region: entries[0].r,
            }));
            setShowPlzSelect(true);
          }
        } catch {
          setPlzError("Fehler beim Laden der PLZ-Daten.");
        }
      }
    },
    [loadPlzData]
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
      }
    },
    [plzEntries]
  );

  // ─── Calculate Results ─────────────────────────────────────────────────
  const calculateResults = useCallback(async () => {
    const person = formState.persons[0];
    const ageGroup = getAgeGroup(person.birthdate);
    const key = buildLookupKey(ageGroup, person.withAccident, person.franchise);

    try {
      const cantonData = await loadCantonPremiums(formState.canton);
      const regionStr = String(formState.region);
      const regionData = cantonData[regionStr];

      if (!regionData) {
        setAllResults([]);
        setRawEntries([]);
        setShowResults(true);
        return;
      }

      const entries = regionData[key];

      if (!entries || entries.length === 0) {
        setAllResults([]);
        setRawEntries([]);
        setShowResults(true);
        return;
      }

      setRawEntries(entries);
      const results = mapToResults(entries, modelFilter);
      setAllResults(results);
      setShowResults(true);
    } catch {
      setAllResults([]);
      setRawEntries([]);
      setShowResults(true);
    }
  }, [formState, modelFilter, loadCantonPremiums]);

  // ─── Display results (re-filter when model/sort changes) ──────────────
  const displayResults = useMemo(() => {
    let results = modelFilter === "all"
      ? [...allResults]
      : mapToResults(rawEntries, modelFilter);

    if (sortOrder === "desc") {
      results.reverse();
    }
    return results;
  }, [allResults, rawEntries, modelFilter, sortOrder]);

  const maxSavings = useMemo(() => {
    if (displayResults.length === 0) return 0;
    const sorted = [...displayResults].sort((a, b) => a.monthlyPremium - b.monthlyPremium);
    return sorted[0].savings;
  }, [displayResults]);

  // ─── Handle model filter change ───────────────────────────────────────
  const handleModelFilterChange = useCallback(
    (newFilter: string) => {
      setModelFilter(newFilter);
      if (rawEntries.length > 0) {
        const results = mapToResults(rawEntries, newFilter);
        setAllResults(results);
      }
    },
    [rawEntries]
  );

  // ─── Step Validation ───────────────────────────────────────────────────
  const canProceed = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return formState.plz.length === 4 && formState.canton !== "" && !plzError;
      case 2:
        return formState.persons.every((p) => p.birthdate !== "");
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  // ─── Person Management ─────────────────────────────────────────────────
  const updatePerson = (id: string, updates: Partial<Person>) => {
    setFormState((prev) => ({
      ...prev,
      persons: prev.persons.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  };

  const addPerson = () => {
    setFormState((prev) => ({
      ...prev,
      persons: [...prev.persons, createPerson()],
    }));
  };

  const removePerson = (id: string) => {
    setFormState((prev) => ({
      ...prev,
      persons: prev.persons.filter((p) => p.id !== id),
    }));
  };

  // ─── Lead Submit ───────────────────────────────────────────────────────
  const handleLeadSubmit = async () => {
    if (!leadConsent || !leadName || !leadEmail || !leadPhone) return;
    setLeadLoading(true);

    try {
      const person = formState.persons[0];
      const cheapest =
        displayResults.length > 0
          ? [...displayResults].sort((a, b) => a.monthlyPremium - b.monthlyPremium)[0]
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
          birthYear: person?.birthdate?.split("-")[0] || "",
          ageGroup: person ? getAgeGroup(person.birthdate) : "ERW",
          franchise: person?.franchise || 0,
          model: modelFilter,
          currentInsurer: formState.currentInsurer,
          currentPremium: formState.currentPremium,
          cheapestInsurer: cheapest?.insurer || "",
          cheapestPremium: cheapest?.monthlyPremium || 0,
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
        alert("Es gab einen Fehler. Bitte versuche es erneut.");
      }
    } catch {
      alert("Verbindungsfehler. Bitte versuche es erneut.");
    } finally {
      setLeadLoading(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[
        { n: 1, label: "Situation & Wohnort" },
        { n: 2, label: "Persönliche Angaben" },
        { n: 3, label: "Grundversicherung" },
        { n: 4, label: "Zusatzversicherung" },
      ].map((s, i) => (
        <div key={s.n} className="flex items-center">
          <button
            onClick={() => s.n < step && setStep(s.n)}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              step === s.n
                ? "bg-[#0f4c5c] text-white shadow-lg shadow-[#0f4c5c]/20"
                : step > s.n
                ? "bg-emerald-100 text-emerald-700 cursor-pointer hover:bg-emerald-200"
                : "bg-stone-100 text-stone-400"
            }`}
          >
            {step > s.n ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              s.n
            )}
          </button>
          <span
            className={`hidden sm:inline ml-2 text-xs font-medium ${
              step === s.n ? "text-[#0f4c5c]" : "text-stone-400"
            }`}
          >
            {s.label}
          </span>
          {i < 3 && (
            <div
              className={`w-8 sm:w-12 h-0.5 mx-2 ${step > s.n ? "bg-emerald-300" : "bg-stone-200"}`}
            />
          )}
        </div>
      ))}
    </div>
  );

  // ───────────────────────────────────────────────────────────────────────
  // RESULTS VIEW
  // ───────────────────────────────────────────────────────────────────────
  if (showResults) {
    const person = formState.persons[0];
    const ageGroup = person ? getAgeGroup(person.birthdate) : "ERW";
    const ageLabel =
      ageGroup === "KIN"
        ? "Kind"
        : ageGroup === "JUG"
        ? "Junger Erwachsener"
        : "Erwachsene/r";

    return (
      <div className="animate-fade-in">
        {premiumLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[#0f4c5c]/20 border-t-[#0f4c5c] rounded-full animate-spin mx-auto mb-4" />
              <p className="text-stone-600 font-medium">Prämien werden geladen...</p>
              <p className="text-stone-400 text-sm mt-1">Offizielle BAG-Daten 2026</p>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold text-center mb-2">
          Dein Prämienvergleich 2026
        </h2>
        <p className="text-center text-stone-500 mb-1">
          {formState.plz} {formState.ort} ({formState.canton}) • Region{" "}
          {formState.region} • {ageLabel} • Franchise CHF{" "}
          {person?.franchise?.toLocaleString("de-CH")}
        </p>
        <p className="text-center text-xs text-stone-400 mb-6">
          Quelle: Bundesamt für Gesundheit (BAG) •{" "}
          {person?.withAccident ? "Mit" : "Ohne"} Unfalldeckung
        </p>

        {/* Savings highlight */}
        {maxSavings > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-6 text-center">
            <div className="text-sm font-medium text-emerald-700">
              Mögliches Sparpotenzial pro Jahr
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-emerald-800 my-1">
              bis CHF {maxSavings.toLocaleString("de-CH")}
            </div>
            <div className="text-xs text-emerald-600 mt-1">
              {displayResults.length} Tarife von{" "}
              {new Set(displayResults.map((r) => r.insurer)).size} Versicherern
            </div>
          </div>
        )}

        {displayResults.length === 0 && !premiumLoading && (
          <div className="text-center py-10">
            <p className="text-stone-500 text-lg">Keine Ergebnisse gefunden.</p>
            <p className="text-stone-400 text-sm mt-2">
              Bitte prüfe deine Angaben oder versuche einen anderen Filter.
            </p>
          </div>
        )}

        {/* Filters */}
        {displayResults.length > 0 && (
          <>
            <div className="flex flex-wrap gap-3 mb-6">
              <select
                value={modelFilter}
                onChange={(e) => handleModelFilterChange(e.target.value)}
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
                onClick={() => {
                  setShowResults(false);
                  setStep(1);
                }}
                className="ml-auto text-sm text-[#0f4c5c] font-medium hover:underline"
              >
                Angaben bearbeiten
              </button>
            </div>

            {/* Result list */}
            <div className="space-y-2">
              {displayResults.slice(0, 20).map((result, i) => (
                <div
                  key={`${result.insurerNr}-${result.model}-${result.modelName}`}
                  className={`card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 ${
                    i === 0 && sortOrder === "asc"
                      ? "ring-2 ring-emerald-400 bg-emerald-50/30"
                      : ""
                  }`}
                  style={{ animation: `slideUp 0.3s ease-out ${i * 0.03}s both` }}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      i === 0 && sortOrder === "asc"
                        ? "bg-emerald-100 text-emerald-700"
                        : i < 3
                        ? "bg-[#0f4c5c]/10 text-[#0f4c5c]"
                        : "bg-stone-100 text-stone-400"
                    }`}
                  >
                    {i + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">{result.insurer}</span>
                      {i === 0 && sortOrder === "asc" && (
                        <span className="savings-badge text-xs">✓ Günstigste</span>
                      )}
                    </div>
                    <div className="text-sm text-stone-500">
                      {MODEL_LABELS[result.model] || result.model}
                      {result.modelName && ` – ${result.modelName}`}
                    </div>
                  </div>

                  {result.savings > 0 && sortOrder === "asc" && (
                    <div className="text-right hidden sm:block">
                      <div className="text-xs text-emerald-600 font-medium">Ersparnis/Jahr</div>
                      <div className="text-sm font-semibold text-emerald-700">
                        CHF {result.savings.toLocaleString("de-CH")}
                      </div>
                    </div>
                  )}

                  <div className="text-right">
                    <div className="text-xl font-bold">
                      <span className="text-sm font-normal text-stone-400">CHF </span>
                      {result.monthlyPremium.toFixed(2)}
                    </div>
                    <div className="text-xs text-stone-400">pro Monat</div>
                  </div>

                  <button
                    onClick={() => setShowLeadModal(true)}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-[#e36414] text-white hover:bg-[#fb8b24] transition-colors flex-shrink-0"
                  >
                    Offerte
                  </button>
                </div>
              ))}
            </div>

            {displayResults.length > 20 && (
              <p className="text-center text-stone-400 text-sm mt-4">
                + {displayResults.length - 20} weitere Tarife verfügbar
              </p>
            )}
          </>
        )}

        {/* Lead Modal */}
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
                    Jetzt Vergleichsofferte erhalten
                  </h3>
                  <p className="text-sm text-stone-500 mb-5">
                    Erhalte eine kostenlose und unverbindliche Offerte basierend auf deinen Angaben.
                  </p>

                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Vor- und Nachname *"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="input-field"
                      required
                    />
                    <input
                      type="email"
                      placeholder="E-Mail-Adresse *"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      className="input-field"
                      required
                    />
                    <div className="flex gap-2">
                      <span className="input-field !w-20 flex items-center justify-center text-sm text-stone-500">
                        🇨🇭 +41
                      </span>
                      <input
                        type="tel"
                        placeholder="Telefonnummer *"
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        className="input-field"
                        required
                      />
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={leadConsent}
                        onChange={(e) => setLeadConsent(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-stone-300 text-[#0f4c5c] focus:ring-[#0f4c5c]"
                      />
                      <span className="text-xs text-stone-500 leading-relaxed">
                        Ich stimme zu, dass meine personenbezogenen Daten verarbeitet werden, um eine
                        Offerte zu erhalten. Meine Daten werden vertraulich behandelt.{" "}
                        <a href="/datenschutz" className="text-[#0f4c5c] underline">
                          Datenschutzerklärung
                        </a>
                        .
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

                    <button
                      onClick={handleLeadSubmit}
                      disabled={!leadConsent || !leadName || !leadEmail || !leadPhone || leadLoading}
                      className="btn-accent w-full py-3.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {leadLoading ? "Wird gesendet..." : "Offerte anfordern"}
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
                    Wir haben deine Anfrage erhalten und melden uns in Kürze bei dir.
                  </p>
                  <p className="text-stone-400 text-xs mt-3">
                    Bei Fragen erreichst du uns unter:
                    <br />
                    <strong className="text-stone-600">info@praemien-vergleichen.ch</strong>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────
  // FORM STEPS
  // ───────────────────────────────────────────────────────────────────────
  return (
    <div className="card-elevated p-6 sm:p-8">
      <StepIndicator />

      {/* ── STEP 1: Situation & Wohnort ── */}
      {step === 1 && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold text-center mb-6">
            Für wen möchtest du jetzt Prämien berechnen?
          </h2>

          {/* Type Selection */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {(
              [
                { value: "single", label: "Einzelperson", icon: "👤" },
                { value: "couple", label: "Paar", icon: "👥" },
                { value: "family", label: "Familie", icon: "👨‍👩‍👧" },
                { value: "unborn", label: "Ungeborenes Kind", icon: "👶" },
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
                    default:
                      persons = [createPerson("p1")];
                  }
                  setFormState((prev) => ({
                    ...prev,
                    calculationType: type.value,
                    persons,
                  }));
                }}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  formState.calculationType === type.value
                    ? "border-[#0f4c5c] bg-[#0f4c5c]/5"
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <span className="text-2xl">{type.icon}</span>
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>

          {/* PLZ Input */}
          <div className="max-w-sm mx-auto">
            <h3 className="font-semibold mb-1">Prämienregion wählen</h3>
            <p className="text-sm text-stone-500 mb-3">
              Die Prämien ändern sich je nach Region
            </p>
            <div className="relative">
              <input
                type="text"
                maxLength={4}
                pattern="[0-9]*"
                inputMode="numeric"
                placeholder="PLZ eingeben"
                value={formState.plz}
                onChange={(e) => handlePlzChange(e.target.value.replace(/\D/g, ""))}
                className={`input-field text-lg ${plzError ? "!border-red-400" : ""}`}
              />
              {plzLoading && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-stone-300 border-t-[#0f4c5c] rounded-full animate-spin" />
                </span>
              )}
              {!plzLoading && formState.ort && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-400">
                  {formState.ort} ({formState.canton})
                </span>
              )}
            </div>

            {plzError && <p className="text-red-500 text-sm mt-2">{plzError}</p>}

            {/* Multi-region selector */}
            {showPlzSelect && plzEntries.length > 1 && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Deine PLZ umfasst mehrere Gemeinden. Bitte wähle:
                </label>
                <select
                  value={`${formState.canton}-${formState.region}-${formState.ort}`}
                  onChange={(e) => {
                    const idx = plzEntries.findIndex(
                      (entry) => `${entry.c}-${entry.r}-${entry.o}` === e.target.value
                    );
                    if (idx >= 0) handlePlzEntrySelect(idx);
                  }}
                  className="select-field"
                >
                  {plzEntries.map((entry, idx) => (
                    <option key={idx} value={`${entry.c}-${entry.r}-${entry.o}`}>
                      {entry.o} – Kanton {entry.c}, Region {entry.r}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {formState.canton && !showPlzSelect && formState.plz.length === 4 && (
              <p className="text-xs text-stone-400 mt-2">
                Prämienregion: {formState.canton}-{formState.region}
              </p>
            )}
          </div>

          {/* Next */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setStep(2)}
              disabled={!canProceed(1)}
              className="btn-accent px-8 py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Weiter
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Persönliche Angaben ── */}
      {step === 2 && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold text-center mb-6">Persönliche Angaben</h2>

          <div className="space-y-6">
            {formState.persons.map((person, idx) => {
              const ageGroup = getAgeGroup(person.birthdate);
              const franchises = getFranchisesForAge(ageGroup);

              return (
                <div key={person.id} className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-stone-700">Person {idx + 1}</h3>
                    {idx > 0 && (
                      <button
                        onClick={() => removePerson(person.id)}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Entfernen
                      </button>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {/* Gender */}
                    <div className="flex gap-2">
                      {(["m", "f"] as const).map((g) => (
                        <button
                          key={g}
                          onClick={() => updatePerson(person.id, { gender: g })}
                          className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                            person.gender === g
                              ? "border-[#0f4c5c] bg-[#0f4c5c]/5 text-[#0f4c5c]"
                              : "border-stone-200 text-stone-500 hover:border-stone-300"
                          }`}
                        >
                          {g === "m" ? "Männlich" : "Weiblich"}
                        </button>
                      ))}
                    </div>

                    {/* Name */}
                    <input
                      type="text"
                      placeholder="Vor- und Nachname"
                      value={person.name}
                      onChange={(e) => updatePerson(person.id, { name: e.target.value })}
                      className="input-field"
                    />

                    {/* Birthdate */}
                    <div>
                      <label className="block text-xs text-stone-500 mb-1">Geburtsdatum *</label>
                      <input
                        type="date"
                        value={person.birthdate}
                        onChange={(e) => updatePerson(person.id, { birthdate: e.target.value })}
                        className="input-field"
                        required
                      />
                    </div>

                    {/* Franchise */}
                    <div>
                      <label className="block text-xs text-stone-500 mb-1">Franchise *</label>
                      <select
                        value={person.franchise}
                        onChange={(e) =>
                          updatePerson(person.id, { franchise: parseInt(e.target.value) })
                        }
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

                  {/* Toggles */}
                  <div className="flex flex-wrap gap-4 mt-3">
                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={person.withAccident}
                        onChange={(e) =>
                          updatePerson(person.id, { withAccident: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-stone-300 text-[#0f4c5c] focus:ring-[#0f4c5c]"
                      />
                      Unfalldeckung einschliessen
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={person.isNewToSwitzerland}
                        onChange={(e) =>
                          updatePerson(person.id, { isNewToSwitzerland: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-stone-300 text-[#0f4c5c] focus:ring-[#0f4c5c]"
                      />
                      Neu in der Schweiz
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

          {/* Add person buttons */}
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={addPerson}
              className="text-sm font-medium text-[#0f4c5c] hover:text-[#1a6b7a] flex items-center gap-1"
            >
              <span className="text-lg">+</span> Personen hinzufügen
            </button>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="text-sm font-medium text-stone-500 hover:text-stone-700 px-4 py-2"
            >
              Zurück
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!canProceed(2)}
              className="btn-accent px-8 py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Weiter
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Grundversicherung (Preferences) ── */}
      {step === 3 && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold text-center mb-2">
            Stell deine Präferenzen ein
          </h2>
          <p className="text-center text-stone-500 text-sm mb-6">
            Personalisiere deine Ergebnisse mit unseren Empfehlungen und Angeboten
          </p>

          {/* Current insurer */}
          <div className="max-w-md mx-auto space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Aktuelle Krankenkasse
              </label>
              <select
                value={formState.currentInsurer}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, currentInsurer: e.target.value }))
                }
                className="select-field"
              >
                <option value="">Wählen...</option>
                {CURRENT_INSURERS.map((ins) => (
                  <option key={ins} value={ins}>
                    {ins}
                  </option>
                ))}
              </select>
            </div>

            {formState.currentInsurer && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Aktuelle Monatsprämie CHF
                </label>
                <input
                  type="number"
                  placeholder="z.B. 450"
                  value={formState.currentPremium}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, currentPremium: e.target.value }))
                  }
                  className="input-field"
                />
              </div>
            )}

            {/* Preference */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-3">
                Passe deine Ergebnisse an, wähle deine Präferenzen:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { value: "cheapest", label: "Günstigste", icon: "💰" },
                    { value: "recommended", label: "Unsere Empfehlungen", icon: "⭐" },
                    { value: "offers", label: "Sonderangebote", icon: "🎁" },
                  ] as const
                ).map((pref) => (
                  <button
                    key={pref.value}
                    onClick={() =>
                      setFormState((prev) => ({ ...prev, preference: pref.value }))
                    }
                    className={`p-3 rounded-xl text-center text-sm font-medium border-2 transition-all ${
                      formState.preference === pref.value
                        ? "border-[#0f4c5c] bg-[#0f4c5c]/5 text-[#0f4c5c]"
                        : "border-stone-200 hover:border-stone-300 text-stone-600"
                    }`}
                  >
                    <span className="text-lg block mb-1">{pref.icon}</span>
                    {pref.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="text-sm font-medium text-stone-500 hover:text-stone-700 px-4 py-2"
            >
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
        </div>
      )}

      {/* ── STEP 4: Zusatzversicherung ── */}
      {step === 4 && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold text-center mb-2">Wähle, was zählt</h2>
          <p className="text-center text-stone-500 text-sm mb-6">
            Welche Zusatzleistungen sind dir wichtig?
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
            {EXTRA_OPTIONS.map((opt) => (
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
                className={`p-3 rounded-xl text-left text-sm border-2 transition-all flex items-center gap-2 ${
                  formState.extras.includes(opt.id)
                    ? "border-[#0f4c5c] bg-[#0f4c5c]/5"
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <span className="text-lg">{opt.icon}</span>
                <span className="font-medium">{opt.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setStep(3)}
              className="text-sm font-medium text-stone-500 hover:text-stone-700 px-4 py-2"
            >
              Zurück
            </button>
            <button
              onClick={calculateResults}
              disabled={premiumLoading}
              className="btn-accent px-8 py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Jetzt vergleichen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
