"use client";

import { useState, useMemo, useCallback } from "react";

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

interface PremiumEntry {
  r: number; // region
  a: string; // age group (KIN/JUG/ERW)
  f: number; // franchise
  u: number; // with accident (1/0)
  i: string; // insurer nr
  n: string; // insurer name
  t: string; // tariff name
  m: string; // model (standard/hausarzt/hmo/telmed/other)
  p: number; // monthly premium
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

// ─── Constants ───────────────────────────────────────────────────────────────

const FRANCHISES_ADULT = [300, 500, 1000, 1500, 2000, 2500];
const FRANCHISES_CHILD = [0, 100, 200, 300, 400, 500, 600];

const CURRENT_INSURERS = [
  "CSS", "Sanitas", "Swica", "Helsana", "Visana", "Concordia",
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
  other: "Andere",
};

// ─── Demo Data Generator (replace with real BAG data) ────────────────────────

function getDemoResults(
  canton: string,
  region: number,
  ageGroup: string,
  franchise: number,
  withAccident: boolean,
  modelFilter: string
): Result[] {
  const insurers = [
    { nr: "572", name: "Assura" },
    { nr: "215", name: "CSS" },
    { nr: "577", name: "Helsana" },
    { nr: "585", name: "Swica" },
    { nr: "534", name: "Groupe Mutuel" },
    { nr: "326", name: "Concordia" },
    { nr: "568", name: "Visana" },
    { nr: "582", name: "Sanitas" },
    { nr: "602", name: "KPT" },
    { nr: "597", name: "Atupri" },
    { nr: "578", name: "ÖKK" },
    { nr: "526", name: "EGK" },
    { nr: "521", name: "Sympany" },
    { nr: "581", name: "Aquilana" },
    { nr: "590", name: "Agrisano" },
  ];

  const models = modelFilter === "all"
    ? ["standard", "hausarzt", "hmo", "telmed"]
    : [modelFilter];

  const basePremium =
    ageGroup === "KIN" ? 120 : ageGroup === "JUG" ? 280 : 380;
  const cantonFactor = (canton.charCodeAt(0) % 10) / 10 + 0.8;
  const franchiseDiscount = (franchise - 300) * 0.08;
  const accidentBonus = withAccident ? 0 : -15;

  const results: Result[] = [];

  for (const ins of insurers) {
    for (const model of models) {
      const modelDiscount =
        model === "standard" ? 0 :
        model === "hausarzt" ? 25 :
        model === "hmo" ? 40 : 30;

      const v = (parseInt(ins.nr) * 7 + canton.charCodeAt(0)) % 60 - 30;
      const monthly = Math.max(
        Math.round(
          (basePremium * cantonFactor - franchiseDiscount - modelDiscount + accidentBonus + v) * 100
        ) / 100,
        80
      );

      results.push({
        insurer: ins.name,
        insurerNr: ins.nr,
        model,
        modelName: `${ins.name} ${MODEL_LABELS[model] || model}`,
        monthlyPremium: monthly,
        yearlyPremium: monthly * 12,
        savings: 0,
      });
    }
  }

  results.sort((a, b) => a.monthlyPremium - b.monthlyPremium);

  if (results.length > 0) {
    const max = results[results.length - 1].monthlyPremium;
    results.forEach((r) => {
      r.savings = Math.round((max - r.monthlyPremium) * 12);
    });
  }

  return results;
}

// ─── Helper: Get age group from birthdate ────────────────────────────────────

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

  // Results state
  const [results, setResults] = useState<Result[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [modelFilter, setModelFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // Lead form
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadConsent, setLeadConsent] = useState(false);
  const [leadNewsletter, setLeadNewsletter] = useState(false);

  // ─── PLZ Lookup (simplified – integrate real regions.json) ──────────────
  const handlePlzChange = useCallback((plz: string) => {
    setFormState((prev) => ({ ...prev, plz }));

    // TODO: Load from data/regions.json
    // For now, derive canton from PLZ (simplified mapping)
    if (plz.length === 4) {
      const num = parseInt(plz);
      let canton = "";
      let ort = "";
      // Simplified PLZ → Canton mapping (replace with real regions.json lookup)
      if (num >= 8000 && num <= 8999) { canton = "ZH"; ort = "Zürich"; }
      else if (num >= 3000 && num <= 3999) { canton = "BE"; ort = "Bern"; }
      else if (num >= 6000 && num <= 6099) { canton = "LU"; ort = "Luzern"; }
      else if (num >= 4000 && num <= 4099) { canton = "BS"; ort = "Basel"; }
      else if (num >= 9000 && num <= 9499) { canton = "SG"; ort = "St. Gallen"; }
      else if (num >= 5000 && num <= 5999) { canton = "AG"; ort = "Aargau"; }
      else if (num >= 6300 && num <= 6399) { canton = "ZG"; ort = "Zug"; }
      else if (num >= 1000 && num <= 1999) { canton = "VD"; ort = "Waadt"; }
      else if (num >= 1200 && num <= 1299) { canton = "GE"; ort = "Genf"; }
      else if (num >= 6500 && num <= 6999) { canton = "TI"; ort = "Tessin"; }
      else if (num >= 7000 && num <= 7999) { canton = "GR"; ort = "Graubünden"; }
      else if (num >= 2000 && num <= 2999) { canton = "NE"; ort = "Neuenburg"; }
      else { canton = "ZH"; ort = "Region"; }

      setFormState((prev) => ({ ...prev, canton, ort, region: 0 }));
    }
  }, []);

  // ─── Calculate Results ─────────────────────────────────────────────────
  const calculateResults = useCallback(() => {
    const person = formState.persons[0];
    const ageGroup = getAgeGroup(person.birthdate);

    const res = getDemoResults(
      formState.canton,
      formState.region,
      ageGroup,
      person.franchise,
      person.withAccident,
      modelFilter
    );
    setResults(res);
    setShowResults(true);
  }, [formState, modelFilter]);

  // ─── Sorted/filtered results ───────────────────────────────────────────
  const displayResults = useMemo(() => {
    let filtered = [...results];
    if (modelFilter !== "all") {
      filtered = filtered.filter((r) => r.model === modelFilter);
    }
    if (sortOrder === "desc") {
      filtered.reverse();
    }
    return filtered;
  }, [results, modelFilter, sortOrder]);

  const maxSavings = results.length > 0
    ? results[0].savings
    : 0;

  // ─── Step Validation ───────────────────────────────────────────────────
  const canProceed = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return formState.plz.length === 4 && formState.canton !== "";
      case 2:
        return formState.persons.every((p) => p.birthdate !== "");
      case 3:
        return true; // optional
      case 4:
        return true; // optional
      default:
        return false;
    }
  };

  // ─── Person Management ─────────────────────────────────────────────────
  const updatePerson = (id: string, updates: Partial<Person>) => {
    setFormState((prev) => ({
      ...prev,
      persons: prev.persons.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
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
    if (!leadConsent) return;

    // TODO: Replace with actual Supabase/LeadsHub integration
    // await supabase.from("leads").insert({...})
    console.log("Lead submitted:", {
      name: leadName,
      email: leadEmail,
      phone: leadPhone,
      newsletter: leadNewsletter,
      formState,
    });

    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    setLeadSubmitted(true);
  };

  // ─── Render ────────────────────────────────────────────────────────────

  // Step indicator
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
          <span className={`hidden sm:inline ml-2 text-xs font-medium ${
            step === s.n ? "text-[#0f4c5c]" : "text-stone-400"
          }`}>
            {s.label}
          </span>
          {i < 3 && (
            <div className={`w-8 sm:w-12 h-0.5 mx-2 ${
              step > s.n ? "bg-emerald-300" : "bg-stone-200"
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  // ───────────────────────────────────────────────────────────────────────
  // RESULTS VIEW
  // ───────────────────────────────────────────────────────────────────────
  if (showResults) {
    return (
      <div className="animate-fade-in">
        <h2 className="text-2xl font-bold text-center mb-2">
          Vergleiche deine Ergebnisse
        </h2>
        <p className="text-center text-stone-500 mb-6">
          {formState.ort} ({formState.canton}) • {formState.persons.length} Person{formState.persons.length > 1 ? "en" : ""}
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
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={modelFilter}
            onChange={(e) => {
              setModelFilter(e.target.value);
              // Recalculate with new filter
              const person = formState.persons[0];
              const ageGroup = getAgeGroup(person.birthdate);
              const res = getDemoResults(
                formState.canton, formState.region, ageGroup,
                person.franchise, person.withAccident, e.target.value
              );
              setResults(res);
            }}
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
            <option value="asc">Niedrig bis hoch</option>
            <option value="desc">Hoch bis niedrig</option>
          </select>

          <button
            onClick={() => { setShowResults(false); setStep(1); }}
            className="ml-auto text-sm text-[#0f4c5c] font-medium hover:underline"
          >
            Angaben bearbeiten
          </button>
        </div>

        {/* Result list */}
        <div className="space-y-2">
          {displayResults.slice(0, 15).map((result, i) => (
            <div
              key={`${result.insurerNr}-${result.model}`}
              className={`card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 ${
                i === 0 && sortOrder === "asc"
                  ? "ring-2 ring-emerald-400 bg-emerald-50/30"
                  : ""
              }`}
              style={{ animation: `slideUp 0.3s ease-out ${i * 0.03}s both` }}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                i === 0 && sortOrder === "asc"
                  ? "bg-emerald-100 text-emerald-700"
                  : i < 3
                  ? "bg-[#0f4c5c]/10 text-[#0f4c5c]"
                  : "bg-stone-100 text-stone-400"
              }`}>
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

        {displayResults.length > 15 && (
          <p className="text-center text-stone-400 text-sm mt-4">
            + {displayResults.length - 15} weitere Ergebnisse
          </p>
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
                        Ich stimme zu, dass meine personenbezogenen Daten verarbeitet
                        werden, um eine Offerte zu erhalten. Meine Daten werden
                        vertraulich behandelt.{" "}
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
                        Ja, ich möchte den Newsletter mit Spartipps, Fristen und
                        einfachen Erklärungen abonnieren.
                      </span>
                    </label>

                    <button
                      onClick={handleLeadSubmit}
                      disabled={!leadConsent || !leadName || !leadEmail || !leadPhone}
                      className="btn-accent w-full py-3.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Offerte anfordern
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
                    Bei Fragen erreichst du uns unter:<br />
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
                placeholder="PLZ / Ort"
                value={formState.plz}
                onChange={(e) => handlePlzChange(e.target.value.replace(/\D/g, ""))}
                className="input-field text-lg"
              />
              {formState.ort && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-400">
                  {formState.ort} ({formState.canton})
                </span>
              )}
            </div>
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
          <h2 className="text-xl font-bold text-center mb-6">
            Persönliche Angaben
          </h2>

          <div className="space-y-6">
            {formState.persons.map((person, idx) => {
              const ageGroup = getAgeGroup(person.birthdate);
              const franchises = getFranchisesForAge(ageGroup);

              return (
                <div key={person.id} className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-stone-700">
                      Person {idx + 1}
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
                      onChange={(e) =>
                        updatePerson(person.id, { name: e.target.value })
                      }
                      className="input-field"
                    />

                    {/* Birthdate */}
                    <div>
                      <label className="block text-xs text-stone-500 mb-1">
                        Geburtsdatum *
                      </label>
                      <input
                        type="date"
                        value={person.birthdate}
                        onChange={(e) =>
                          updatePerson(person.id, { birthdate: e.target.value })
                        }
                        className="input-field"
                        required
                      />
                    </div>

                    {/* Franchise */}
                    <div>
                      <label className="block text-xs text-stone-500 mb-1">
                        Franchise *
                      </label>
                      <select
                        value={person.franchise}
                        onChange={(e) =>
                          updatePerson(person.id, {
                            franchise: parseInt(e.target.value),
                          })
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
                          updatePerson(person.id, {
                            withAccident: e.target.checked,
                          })
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
                          updatePerson(person.id, {
                            isNewToSwitzerland: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-stone-300 text-[#0f4c5c] focus:ring-[#0f4c5c]"
                      />
                      Neu in der Schweiz
                    </label>
                  </div>

                  {person.isNewToSwitzerland && (
                    <div className="mt-3">
                      <label className="block text-xs text-stone-500 mb-1">
                        Einreisedatum
                      </label>
                      <input
                        type="date"
                        value={person.entryDate}
                        onChange={(e) =>
                          updatePerson(person.id, { entryDate: e.target.value })
                        }
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
                  setFormState((prev) => ({
                    ...prev,
                    currentInsurer: e.target.value,
                  }))
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
                    setFormState((prev) => ({
                      ...prev,
                      currentPremium: e.target.value,
                    }))
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
                      setFormState((prev) => ({
                        ...prev,
                        preference: pref.value,
                      }))
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
              onClick={() => {
                calculateResults();
              }}
              className="btn-accent px-8 py-3 rounded-xl"
            >
              Ergebnis anzeigen
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 4: Zusatzversicherung ── */}
      {step === 4 && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold text-center mb-2">
            Wähle, was zählt
          </h2>
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
              className="btn-accent px-8 py-3 rounded-xl"
            >
              Jetzt vergleichen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
