import { useMemo, useState } from "react";
import "./GovernmentSchemes.css";

type Scheme = {
  name: string;
  category: string;
  summary: string;
  eligibility: string;
  benefit: string;
  portal: string;
  portalLabel: string;
};

const schemes: Scheme[] = [
  {
    name: "PM-KISAN",
    category: "Income Support",
    summary: "Central income-support scheme for eligible landholding farmer families.",
    eligibility: "Eligibility, exclusions and land-record requirements apply. Not every farmer qualifies.",
    benefit: "Eligible beneficiaries may receive ₹6,000 per year in three instalments, subject to current scheme rules.",
    portal: "https://pmkisan.gov.in/",
    portalLabel: "Official PM-KISAN portal",
  },
  {
    name: "Pradhan Mantri Fasal Bima Yojana",
    category: "Crop Insurance",
    summary: "Crop insurance framework for eligible notified crops and areas.",
    eligibility: "Availability depends on notified crops, area, season and current enrolment rules.",
    benefit: "Coverage and premium depend on the crop, season and applicable guidelines.",
    portal: "https://pmfby.gov.in/",
    portalLabel: "Official crop insurance portal",
  },
  {
    name: "Kisan Credit Card",
    category: "Credit",
    summary: "Agricultural credit facility available through participating banks and institutions.",
    eligibility: "The lending institution assesses applicant, farming activity and required documents.",
    benefit: "Credit limits, interest and repayment terms depend on eligibility and applicable rules.",
    portal: "https://www.myscheme.gov.in/",
    portalLabel: "Find scheme information",
  },
  {
    name: "PM Krishi Sinchayee Yojana",
    category: "Irrigation",
    summary: "Government programme supporting eligible irrigation and water-use initiatives through applicable components.",
    eligibility: "Component, location, applicant category and state implementation rules apply.",
    benefit: "Support is not universal; check the current component and state guidelines.",
    portal: "https://pmksy.gov.in/",
    portalLabel: "Official PMKSY portal",
  },
  {
    name: "Agriculture Infrastructure Fund",
    category: "Infrastructure",
    summary: "Financing framework for eligible agricultural infrastructure projects.",
    eligibility: "Eligible project types, applicants and current scheme guidelines determine access.",
    benefit: "Financing support is subject to current programme rules and lender approval.",
    portal: "https://agriinfra.dac.gov.in/",
    portalLabel: "Official AIF portal",
  },
  {
    name: "PM Formalisation of Micro Food Processing Enterprises",
    category: "Food Processing",
    summary: "Support framework for eligible micro food-processing enterprises.",
    eligibility: "Enterprise type, project, state implementation and application conditions apply.",
    benefit: "Assistance depends on the current guidelines and approval of the application.",
    portal: "https://pmfme.mofpi.gov.in/",
    portalLabel: "Official PMFME portal",
  },
  {
    name: "State Agriculture & Horticulture Schemes",
    category: "State Support",
    summary: "State departments may offer crop-specific, horticulture, machinery or farmer-support programmes.",
    eligibility: "Rules differ by state, district, farmer category and application period.",
    benefit: "Check current notifications and application windows with your state department.",
    portal: "https://www.myscheme.gov.in/",
    portalLabel: "Search official scheme directory",
  },
];

const categories = [
  "All schemes",
  "Income Support",
  "Crop Insurance",
  "Credit",
  "Irrigation",
  "Infrastructure",
  "Food Processing",
  "State Support",
];

export default function GovernmentSchemes() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All schemes");
  const [saved, setSaved] = useState<string[]>([]);
  const [showSaved, setShowSaved] = useState(false);

  const filtered = useMemo(() => schemes.filter(scheme => {
    const matchesSearch = `${scheme.name} ${scheme.summary} ${scheme.category}`
      .toLowerCase().includes(search.toLowerCase().trim());
    const matchesCategory = category === "All schemes" || scheme.category === category;
    const matchesSaved = !showSaved || saved.includes(scheme.name);
    return matchesSearch && matchesCategory && matchesSaved;
  }), [search, category, saved, showSaved]);

  return (
    <main className="schemes-page">
      <header className="schemes-heading">
        <span className="schemes-eyebrow">HALDHARA FARMER SERVICES</span>
        <h1>Government Schemes & Subsidies</h1>
        <p>Explore agricultural support programmes and find their official information portals.</p>
      </header>

      <section className="schemes-notice">
        <strong>Verify before applying.</strong>
        Scheme details, eligibility, benefits and application windows may change.
        This directory is a starting point, not a guarantee of eligibility or approval.
        Always confirm current rules on the linked official portal or with your local agriculture office.
      </section>

      <section className="schemes-search-panel">
        <label className="schemes-search">
          Search schemes
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Try crop insurance, credit, irrigation..."
          />
        </label>
        <label className="schemes-category">
          Category
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map(item => <option key={item}>{item}</option>)}
          </select>
        </label>
        <button
          type="button"
          className={showSaved ? "schemes-filter-button active" : "schemes-filter-button"}
          onClick={() => setShowSaved(v => !v)}
        >
          {showSaved ? "Show all schemes" : `Saved (${saved.length})`}
        </button>
      </section>

      <div className="schemes-results-label">
        <h2>{showSaved ? "Saved schemes" : "Explore schemes"}</h2>
        <span>{filtered.length} result{filtered.length === 1 ? "" : "s"}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="schemes-empty">
          <span>🔎</span>
          <strong>No schemes found</strong>
          <p>Try another keyword or category. Saved schemes are only kept in this session.</p>
        </div>
      ) : (
        <section className="schemes-grid">
          {filtered.map(scheme => {
            const isSaved = saved.includes(scheme.name);
            return (
              <article className="scheme-card" key={scheme.name}>
                <div className="scheme-card-top">
                  <span className="scheme-icon">🌾</span>
                  <span className="scheme-category">{scheme.category}</span>
                  <button
                    type="button"
                    className={isSaved ? "scheme-save saved" : "scheme-save"}
                    aria-label={isSaved ? `Unsave ${scheme.name}` : `Save ${scheme.name}`}
                    onClick={() => setSaved(old => isSaved ? old.filter(name => name !== scheme.name) : [...old, scheme.name])}
                  >
                    {isSaved ? "★ Saved" : "☆ Save"}
                  </button>
                </div>
                <h3>{scheme.name}</h3>
                <p className="scheme-summary">{scheme.summary}</p>
                <div className="scheme-detail">
                  <strong>Eligibility</strong>
                  <p>{scheme.eligibility}</p>
                </div>
                <div className="scheme-detail">
                  <strong>Benefits</strong>
                  <p>{scheme.benefit}</p>
                </div>
                <a className="scheme-link" href={scheme.portal} target="_blank" rel="noopener noreferrer">
                  {scheme.portalLabel} ↗
                </a>
              </article>
            );
          })}
        </section>
      )}

      <section className="schemes-help">
        <span aria-hidden="true">👨‍🌾</span>
        <div>
          <h3>Need help with an application?</h3>
          <p>Contact your local agriculture or horticulture department, Krishi Vigyan Kendra (KVK), or participating bank as appropriate. Ask which documents and deadlines currently apply to your scheme.</p>
        </div>
      </section>

      <p className="schemes-footnote">
        Scheme descriptions are introductory summaries. Saved items and search preferences are not
        persisted to your account. Haldhara does not submit applications or verify your eligibility.
      </p>
    </main>
  );
}
