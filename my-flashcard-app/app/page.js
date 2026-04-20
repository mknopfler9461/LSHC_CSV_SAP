"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, LayoutGrid, Globe, ShieldCheck, Zap, BookOpen } from 'lucide-react';

const flashcards = [
  // SET 1: Global CSV Strategy & GxP Fundamentals
  { category: "Global CSV & GxP", q: "What is the primary difference between GxP and CSV?", a: "GxP defines WHAT must be controlled (quality, safety, data integrity); CSV is the METHODOLOGY used to prove and sustain that control for computerized systems." },
  { category: "Global CSV & GxP", q: "What is the 'Symbiotic Relationship' in SAP programs?", a: "GxP provides the regulatory intent, while CSV provides the documented assurance that SAP fulfills that intent." },
  { category: "Global CSV & GxP", q: "How does 'Intended Use' drive validation scope?", a: "CSV focuses on how the system is actually used. A module like Finance may be non-GxP, while Quality Management (QM) is designated GxP-critical." },
  { category: "Global CSV & GxP", q: "What is the 'ALCOA+' principle for data integrity?", a: "Attributable, Legible, Contemporaneous, Original, Accurate + Complete, Consistent, Enduring, and Available." },
  { category: "Global CSV & GxP", q: "Define FDA 21 CFR Part 11.", a: "A binding US regulation focused on the trustworthiness and reliability of electronic records and electronic signatures." },
  { category: "Global CSV & GxP", q: "Define EU GMP Annex 11.", a: "A guidance document applying to all GMP-relevant computerized systems in the EU (widely treated as a requirement)." },
  { category: "Global CSV & GxP", q: "What is the core philosophy of Computer Software Assurance (CSA)?", a: "'Critical Thinking First, Documentation Second.' It shifts focus from creating paper evidence to assessing risk and system performance." },
  { category: "Global CSV & GxP", q: "In GAMP 5, what category is a standard SAP ERP system?", a: "Category 4 (Configured Products), though custom ABAP code falls under Category 5." },
  { category: "Global CSV & GxP", q: "What is the role of the Requirements Traceability Matrix (RTM)?", a: "It connects every GxP requirement to a specific design element and test case to ensure no regulatory gaps exist." },
  { category: "Global CSV & GxP", q: "What is the purpose of Design Qualification (DQ)?", a: "To provide documented evidence that the proposed design of the SAP system is suitable for its intended purpose." },
  { category: "Global CSV & GxP", q: "What does Installation Qualification (IQ) verify?", a: "That the SAP landscape (servers, database, client) is installed according to the approved design and vendor specs." },
  { category: "Global CSV & GxP", q: "What does Operational Qualification (OQ) verify?", a: "That the system functions as intended across its anticipated operating ranges (functional testing)." },
  { category: "Global CSV & GxP", q: "What does Performance Qualification (PQ) verify?", a: "That the system, integrated into the business process, performs consistently and meets user requirements." },
  { category: "Global CSV & GxP", q: "Why is 'Supplier Audit' critical in CSV?", a: "Regulators require companies to ensure their software vendors (like SAP) maintain high-quality standards and robust QMS." },
  { category: "Global CSV & GxP", q: "What is 'Direct Impact' in a GxP assessment?", a: "A system function that directly affects product quality or patient safety, such as a batch release decision." },
  { category: "Global CSV & GxP", q: "What is the role of the Quality Unit in CSV?", a: "They act as the final authority, reviewing and approving validation plans, protocols, and summary reports." },
  { category: "Global CSV & GxP", q: "Define 'Change Control' in a validated state.", a: "A formal process to ensure no unauthorized changes are made and that authorized changes are assessed for GxP impact." },
  { category: "Global CSV & GxP", q: "What are 'Audit Trails' in SAP?", a: "Computer-generated, time-stamped records that track who did what and when, ensuring data cannot be altered undetected." },
  { category: "Global CSV & GxP", q: "What is 'Legacy System Validation'?", a: "The retrospective validation of an existing system that was not originally implemented under a formal CSV lifecycle." },
  { category: "Global CSV & GxP", q: "How does SAP handle 'Electronic Signatures'?", a: "Through built-in frameworks (Digital Signatures) requiring a unique ID and password for critical GxP actions." },
  { category: "Global CSV & GxP", q: "What is a 'Validation Plan'?", a: "A document defining the scope, approach, roles, and acceptance criteria for the validation project." },
  { category: "Global CSV & GxP", q: "What is a 'Validation Summary Report' (VSR)?", a: "The final document confirming the system is fit for intended use based on test results." },
  { category: "Global CSV & GxP", q: "How does CSV apply to SAP interfaces?", a: "Validation must prove that data is transferred accurately and completely between SAP and peripheral systems (LIMS, MES)." },
  { category: "Global CSV & GxP", q: "What is 'Periodic Review'?", a: "A scheduled assessment to ensure the system remains in a validated state and compliant with current regulations." },
  { category: "Global CSV & GxP", q: "What is 'Data Migration Validation'?", a: "The process of proving that data moved from a legacy system to SAP is complete, accurate, and consistent." },

  // SET 2: S/4HANA Cloud PCE & Methodology
  { category: "S/4HANA PCE", q: "What is the SAP Quality Requirements Schedule (QRS)?", a: "A legal addendum for PCE that provides audit rights and access to SAP’s own QMS documentation." },
  { category: "S/4HANA PCE", q: "What is the role of SAP Cloud ALM in CSV?", a: "It serves as the single source of truth for requirements, testing, and traceability in S/4HANA PCE projects." },
  { category: "S/4HANA PCE", q: "Why is 'Fit-to-Standard' critical for CSV?", a: "It identifies 'Delta Requirements'—gaps between standard SAP and business needs that require custom validation." },
  { category: "S/4HANA PCE", q: "In PCE, who is responsible for Infrastructure (IQ) validation?", a: "SAP manages infrastructure; the customer verifies SAP’s performance via QRS and SOC reports." },
  { category: "S/4HANA PCE", q: "What is the 'Clean Core' strategy in CSV?", a: "Avoiding custom code (Cat 5) in favor of standard features to reduce validation burden during cloud upgrades." },
  { category: "S/4HANA PCE", q: "How does SAP BTP impact CSV?", a: "Extensions on BTP must be validated separately, often using API-based testing for integration." },
  { category: "S/4HANA PCE", q: "What tool is used for automated regression testing in SAP?", a: "Tricentis Tosca (integrated with Cloud ALM) is a primary tool for industrializing GxP testing." },
  { category: "S/4HANA PCE", q: "What is the purpose of 'LiveCompare' or 'Panaya'?", a: "To perform change-impact analysis, identifying which GxP-critical objects are affected by a patch or upgrade." },
  { category: "S/4HANA PCE", q: "What is 'Continuous Validation' in a cloud environment?", a: "A strategy using automation to re-verify the validated state whenever a change or patch is applied." },
  { category: "S/4HANA PCE", q: "How are 'Delta Requirements' documented?", a: "Captured as user stories or requirements in Cloud ALM during Explore phase workshops." },
  { category: "S/4HANA PCE", q: "What is a 'Validation Instance' in PCE?", a: "A dedicated environment (usually Pre-Prod) where OQ and PQ testing are officially executed." },
  { category: "S/4HANA PCE", q: "What is 'Unscripted Testing' in the CSA model?", a: "Testing based on expert knowledge to find edge cases, rather than following rigid pre-written steps." },
  { category: "S/4HANA PCE", q: "Why is 'Configuration' treated as GAMP Category 4?", a: "It uses built-in software parameters to meet needs without changing underlying source code." },
  { category: "S/4HANA PCE", q: "How does SAP handle 'Patch Management' in PCE?", a: "SAP provides release notes; the customer performs GxP impact assessment and regression testing." },
  { category: "S/4HANA PCE", q: "What is the 'RACI' for CSV governance?", a: "Matrix defining Responsible, Accountable, Consulted, Informed (e.g., Process Owner vs. Quality Unit)." },
  { category: "S/4HANA PCE", q: "What is 'Paperless Validation'?", a: "Using platforms like Kneat Gx or ValGenesis to manage the validation lifecycle digitally." },
  { category: "S/4HANA PCE", q: "How does 'Agile' delivery work with CSV?", a: "Validation deliverables are completed in 'sprints' with incremental reviews by the Quality Unit." },
  { category: "S/4HANA PCE", q: "What is 'Functional Equivalence' verification?", a: "Proving that the new S/4HANA system performs the same GxP tasks as the legacy ECC system." },
  { category: "S/4HANA PCE", q: "Why is the 'Discover Phase' important for CSV?", a: "It defines the initial CSV strategy, tool selection, and high-level GxP impact assessments." },
  { category: "S/4HANA PCE", q: "What is 'Regression Testing' in an SAP context?", a: "Re-testing unchanged parts to ensure updates haven't introduced defects in GxP processes." },
  { category: "S/4HANA PCE", q: "How is 'User Access' validated in the cloud?", a: "By verifying Segregation of Duties (SoD) and restricting GxP-sensitive roles." },
  { category: "S/4HANA PCE", q: "What is a 'Dry Run' in validation?", a: "Unofficial execution of test scripts to catch errors before the formal validation run." },
  { category: "S/4HANA PCE", q: "What is 'Business Process Monitoring' in Cloud ALM?", a: "A tool ensuring GxP-critical business processes continue to run correctly in production." },
  { category: "S/4HANA PCE", q: "Why use 'Mock Data' for OQ?", a: "To test system logic without using sensitive, real-world GxP data." },
  { category: "S/4HANA PCE", q: "What is 'Transport Management' in CSV?", a: "Formal control of moving configuration/code from Dev to Quality to Production." },

  // SET 3: China-Specific Compliance
  { category: "China Compliance", q: "What is the NMPA’s role in China CSV?", a: "The National Medical Products Administration sets standards for med-device and drug manufacturing in China." },
  { category: "China Compliance", q: "How does NMPA's 'Annex on Computerized Systems' compare to Annex 11?", a: "Broader scope; covers R&D, trials, manufacturing, and post-market surveillance." },
  { category: "China Compliance", q: "What is the 'Personal Information Protection Law' (PIPL)?", a: "China’s data privacy law, similar to GDPR but with stricter local residency requirements." },
  { category: "China Compliance", q: "What is 'Data Localization' in China?", a: "The requirement that 'Important Data' and personal info must be stored on servers within China." },
  { category: "China Compliance", q: "What is the 'Data Security Law' (DSL)?", a: "Classifies data by importance to national security and regulates its handling and transfer." },
  { category: "China Compliance", q: "Define 'Multi-Level Protection Scheme' (MLPS) 2.0.", a: "A mandatory cybersecurity framework; GxP SAP systems usually require Level 3 compliance." },
  { category: "China Compliance", q: "What is the 'Golden Tax Interface' (GTI)?", a: "Mandatory integration for exporting billing data from SAP to the Chinese government tax system." },
  { category: "China Compliance", q: "Why must GTI be validated?", a: "To ensure invoice splitting and VAT calculations meet strict tax laws and prevent data integrity issues." },
  { category: "China Compliance", q: "What language is required for NMPA validation documents?", a: "Deliverables (VMP, URS, reports) must be in Chinese for NMPA inspections." },
  { category: "China Compliance", q: "How does 'Cross-Border Data Transfer' work for SAP?", a: "Companies must pass a CAC security assessment before sending GxP data abroad." },
  { category: "China Compliance", q: "What is 'Important Data' under Chinese law?", a: "Data that, if leaked, could impact national security or public interest (e.g., health data)." },
  { category: "China Compliance", q: "Are digital signatures from DocuSign valid for NMPA?", a: "Only if using CA-certified digital certificates complying with China Electronic Signature Law." },
  { category: "China Compliance", q: "What is the risk of using a Global Template in China?", a: "Standard global designs may not comply with NMPA requirements or local tax/legal rules." },
  { category: "China Compliance", q: "Does NMPA recognize FDA or EMA validation?", a: "NMPA requires domestic proof of compliance during on-site inspections despite global alignment." },
  { category: "China Compliance", q: "What is the 'Federated Validation' model for China?", a: "Global backbone for common design + local 'Annexes' for China-specific regulations." },
  { category: "China Compliance", q: "How is 'User Consent' handled under PIPL?", a: "SAP must capture/log explicit consent for processing sensitive personal data." },
  { category: "China Compliance", q: "What is 'MLPS Level 3' certification?", a: "Mandatory certification involving annual third-party audits of data centers and applications." },
  { category: "China Compliance", q: "How does Alibaba Cloud impact SAP CSV in China?", a: "Many SAP China instances run on Alibaba Cloud, requiring specialized cloud vendor validation evidence." },
  { category: "China Compliance", q: "What is 'Invoice Splitting' validation?", a: "Testing SAP's ability to split one large billing doc into multiple GTI-compliant invoices." },
  { category: "China Compliance", q: "What is a 'Critical Information Infrastructure' (CII) operator?", a: "Entities in sectors like health with the highest data security requirements in China." },
  { category: "China Compliance", q: "Why is 'Contemporaneous Recording' stressed by NMPA?", a: "Inspectors check if manufacturing data was entered at the actual time of the event." },
  { category: "China Compliance", q: "What is 'Chinese Localization' in SAP (Add-on)?", a: "Pre-configured settings for China's unique financial and legal requirements." },
  { category: "China Compliance", q: "How are 'Security Incidents' reported in China?", a: "Under DSL/MLPS, companies must report breaches to local authorities within designated hours." },
  { category: "China Compliance", q: "What is the 'Right to be Forgotten' in PIPL?", a: "Requirement for SAP systems to allow deletion of personal data upon request." },
  { category: "China Compliance", q: "What is 'NMPA PIC/S Accession'?", a: "China's effort to align GMP standards with international norms, reducing validation gaps." },

  // SET 4: Advanced Architecture & Tools
  { category: "Architecture & Tools", q: "Which SAP modules typically fall under GMP (Manufacturing)?", a: "PP/PP-PI, QM, MM, EWM/WM, Batch Management, and ATTP (Serialization)." },
  { category: "Architecture & Tools", q: "Which SAP modules are primarily governed by GDP (Distribution)?", a: "SD (Sales and Distribution), LE-TRA (Transportation), and Serialization components." },
  { category: "Architecture & Tools", q: "How does GLP (Laboratory) manifest in SAP?", a: "Through integration between the QM module and external LIMS (Lab Systems)." },
  { category: "Architecture & Tools", q: "What is the regulatory status of EU Annex 11 vs FDA Part 11?", a: "Part 11 is binding US law; Annex 11 is EU guidance (though enforced as a standard)." },
  { category: "Architecture & Tools", q: "What is a GAMP Category 3 system?", a: "Non-configured products (COTS) used 'as is' without business-specific configuration." },
  { category: "Architecture & Tools", q: "What is the focus of 'Interface Validation'?", a: "Proving data integrity and mapping accuracy during hand-offs between systems." },
  { category: "Architecture & Tools", q: "How does Cloud ALM centralize validation deliverables?", a: "It links URS, Functional Specs, Test Cases, and the RTM in one digital environment." },
  { category: "Architecture & Tools", q: "Define the 'Federated Validation' pattern.", a: "Maintaining a global validation backbone while adding local annexes for specific regions." },
  { category: "Architecture & Tools", q: "Name two leading 'Paperless Validation' platforms.", a: "Kneat Gx and ValGenesis VLMS." },
  { category: "Architecture & Tools", q: "What tool identifies affected GxP objects during a patch?", a: "LiveCompare or Panaya (Change-Impact Analysis tools)." },
  { category: "Architecture & Tools", q: "Define the 'Bluefield' migration path.", a: "A selective data transition moving chosen processes to S/4HANA, balancing Greenfield and Brownfield." },
  { category: "Architecture & Tools", q: "What is the 'Clean Core' benefit for CSV?", a: "Reduces Cat 5 custom code footprint, simplifying the validation of future upgrades." },
  { category: "Architecture & Tools", q: "What does 'Enduring' mean in ALCOA+?", a: "Ensuring records are readable and exist for the entire required retention period." },
  { category: "Architecture & Tools", q: "What is the NMPA Annex scope for computerized systems?", a: "Broad scope: R&D, Clinical Trials, Manufacturing, and Post-Market." },
  { category: "Architecture & Tools", q: "What is the 'GTI' validation requirement?", a: "Proving accurate export of billing data to the state tax system for legal compliance." },
  { category: "Architecture & Tools", q: "What is required for MLPS Level 3 certification?", a: "Self-assessment plus mandatory annual audits by a certified third-party agency." },
  { category: "Architecture & Tools", q: "How does expert expertise apply in CSA 'Unscripted Testing'?", a: "Testers explore the system to find bugs rather than following a rigid pass/fail script." },
  { category: "Architecture & Tools", q: "What are 'Delta Requirements'?", a: "Business needs not met by SAP Best Practice, requiring custom configuration/code." },
  { category: "Architecture & Tools", q: "What does the PCE 'QRS' grant the customer?", a: "Legal audit rights over SAP's cloud infrastructure and QMS documentation." },
  { category: "Architecture & Tools", q: "What is 'Continuous Validation'?", a: "Using automated regression to keep the system validated through cloud updates." },
  { category: "Architecture & Tools", q: "Why is 'Traceability' the heart of CSV?", a: "It proves every regulatory requirement was designed, built, and successfully tested." },
  { category: "Architecture & Tools", q: "What is the role of the 'Process Owner'?", a: "The individual responsible for the business process and its 'Intended Use' compliance." },
  { category: "Architecture & Tools", q: "How does China's DSL classify data?", a: "Categorizes data based on national security impact to determine protection levels." },
  { category: "Architecture & Tools", q: "What is 'Data Residency' under PIPL?", a: "Storing personal and important data on servers physically located inside China." },
  { category: "Architecture & Tools", q: "What is the 'V-Model'?", a: "Lifecycle model mapping requirement phases (URS/FS) to testing phases (PQ/OQ)." }
];

const categories = [
  { name: "All Cards", icon: LayoutGrid, color: "text-slate-600" },
  { name: "Global CSV & GxP", icon: Globe, color: "text-blue-600" },
  { name: "S/4HANA PCE", icon: Zap, color: "text-amber-600" },
  { name: "China Compliance", icon: ShieldCheck, color: "text-red-600" },
  { name: "Architecture & Tools", icon: BookOpen, color: "text-emerald-600" },
];

export default function FlashcardApp() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Cards");
  const [filteredCards, setFilteredCards] = useState(flashcards);

  useEffect(() => {
    const filtered = activeCategory === "All Cards" 
      ? flashcards 
      : flashcards.filter(card => card.category === activeCategory);
    setFilteredCards(filtered);
    setCurrentIdx(0);
    setIsFlipped(false);
  }, [activeCategory]);

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIdx((prev) => (prev + 1) % filteredCards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIdx((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
    }, 150);
  };

  const resetProgress = () => {
    setCurrentIdx(0);
    setIsFlipped(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 mb-8 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">SAP CSV & GxP in LSHC</h1>
            <p className="text-sm text-slate-500 font-medium">Engagement Wiki for Regulatory Compliance prepared by Mark & Xincheng, April 2026</p>
          </div>
          
          <nav className="flex bg-slate-100 p-1 rounded-lg overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
                  activeCategory === cat.name 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <cat.icon size={14} />
                {cat.name}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6">
        {/* Progress Tracker */}
        <div className="mb-6 flex justify-between items-end">
          <div className="flex-1 mr-4">
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
              <span>Progress</span>
              <span>{currentIdx + 1} / {filteredCards.length}</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full transition-all duration-500 ease-out"
                style={{ width: `${((currentIdx + 1) / filteredCards.length) * 100}%` }}
              />
            </div>
          </div>
          <button 
            onClick={resetProgress}
            className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
            title="Reset Category"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        {/* Flashcard Area */}
        <div className="relative h-80 perspective-1000 group">
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className={`relative w-full h-full transition-all duration-500 preserve-3d cursor-pointer ${
              isFlipped ? "rotate-y-180" : ""
            }`}
          >
            {/* Front Side */}
            <div className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 p-10 flex flex-col justify-center items-center text-center">
              <span className="absolute top-6 left-6 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest">
                Question
              </span>
              <p className="text-lg md:text-xl font-medium leading-relaxed text-slate-700">
                {filteredCards[currentIdx]?.q}
              </p>
              <p className="mt-8 text-xs font-bold text-slate-300 animate-pulse">
                Click to reveal answer
              </p>
            </div>

            {/* Back Side */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-2xl p-10 flex flex-col justify-center items-center text-center">
              <span className="absolute top-6 left-6 px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest">
                Answer
              </span>
              <p className="text-lg md:text-xl font-medium leading-relaxed text-white">
                {filteredCards[currentIdx]?.a}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="mt-10 flex items-center justify-between gap-6">
          <button 
            onClick={prevCard}
            className="flex-1 bg-white border border-slate-200 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all"
          >
            <ChevronLeft size={20} />
            Prev
          </button>
          
          <button 
            onClick={nextCard}
            className="flex-1 bg-slate-900 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-white shadow-lg shadow-slate-300 hover:bg-slate-800 active:scale-95 transition-all"
          >
            Next
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            Category: {filteredCards[currentIdx]?.category}
          </p>
          <div className="flex justify-center gap-4 text-slate-300">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
          </div>
        </div>
      </main>

      <style jsx global>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}