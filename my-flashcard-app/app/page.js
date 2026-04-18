"use client";
import React, { useState } from 'react';

const flashcardData = [
  {
    "category": "Global SAP CSV",
    "cards": [
      { "id": 1, "question": "What is the primary goal of Computer System Validation (CSV) in SAP projects?", "answer": "To provide documented evidence that the SAP system consistently performs according to its intended use and meets GxP regulatory requirements." },
      { "id": 2, "question": "Explain the relationship between CSV and GxP.", "answer": "CSV is the process used to ensure that computerized systems (like SAP) comply with GxP (Good Practice) regulations, such as GMP, GDP, and GCP." },
      { "id": 3, "question": "What is the 'V-Model' in the context of SAP CSV?", "answer": "A SDLC framework that maps requirements (User Requirements, Functional Specs) directly to their corresponding testing phases (IQ, OQ, PQ)." },
      { "id": 4, "question": "What does GAMP 5 stand for, and why is it important?", "answer": "Good Automated Manufacturing Practice (Version 5); it is the industry-standard risk-based approach for compliant GxP computerized systems." },
      { "id": 5, "question": "How does CSV impact the SAP Blueprinting phase?", "answer": "It requires the early definition of User Requirements (URS) and a Risk Assessment to determine which SAP processes are GxP-relevant." },
      { "id": 6, "question": "What are the common pitfalls in SAP CSV projects?", "answer": "Underestimating documentation effort, lack of early QA involvement, and failing to define clear system boundaries." },
      { "id": 7, "question": "What is an Installation Qualification (IQ)?", "answer": "Evidence that the SAP software and hardware infrastructure are installed correctly according to specifications." },
      { "id": 8, "question": "What is an Operational Qualification (OQ)?", "answer": "Functional testing to verify that the SAP system operates as intended across all operational ranges." },
      { "id": 9, "question": "What is a Performance Qualification (PQ)?", "answer": "Testing the integrated SAP system under real-world conditions to ensure it consistently meets performance criteria." },
      { "id": 10, "question": "Why is 'Electronic Signature' (21 CFR Part 11) critical in SAP CSV?", "answer": "It ensures that digital approvals in SAP are as legally binding and traceable as handwritten signatures." },
      { "id": 11, "question": "What is the purpose of a Traceability Matrix (TM)?", "answer": "To link each requirement (URS) to its functional design (FS), technical build, and final test case (OQ/PQ) for audit readiness."},
      { "id": 12, "question": "How does 'Data Integrity' apply to SAP CSV?", "answer": "It follows the ALCOA+ principles (Attributable, Legible, Contemporaneous, Original, Accurate) to ensure data is trustworthy throughout its lifecycle."},
      { "id": 13, "question": "What is a 'Validation Summary Report' (VSR)?", "answer": "The final document that summarizes the validation activities and confirms the system is 'Live' and compliant."},
      { "id": 14, "question": "What is the 'intended use' principle?", "answer": "The core of CSV; validation is not about the software's features, but whether it works for the specific business process it was designed for."},
      { "id": 15, "question": "How does Change Management intersect with CSV?", "answer": "Any post-go-live change to a validated SAP system must undergo a formal impact assessment and re-validation if GxP-relevant."},
      { "id": 16, "question": "What is Category 4 vs Category 5 in GAMP 5?", "answer": "Category 4 is configured software (standard SAP), while Category 5 is custom-coded software (ABAP developments)."},
      { "id": 17, "question": "What is a Functional Risk Assessment (FRA)?", "answer": "A step to identify which specific SAP functions carry high risk to patient safety or product quality."},
      { "id": 18, "question": "Who is responsible for the final 'release' of a validated system?", "answer": "The Quality Unit (QA) and the System Owner."},
      { "id": 19, "question": "What are peripheral systems in SAP CSV?", "answer": "External systems (LIMS, MES, WMS) that exchange GxP data with SAP and require interface validation."},
      { "id": 20, "question": "Define 'Legacy System Migration' in CSV.", "answer": "The process of moving GxP data from an old system to SAP while maintaining data integrity and audit trails."},
      { "id": 21, "question": "What is 'Retrospective Validation'?", "answer": "Validating an existing system that is already in use but lacks full documentation (rarely recommended today)."},
      { "id": 22, "question": "What is a Validation Plan (VP)?", "answer": "The roadmap defining the scope, responsibilities, and acceptance criteria for the entire SAP validation project."},
      { "id": 23, "question": "What is a 'Critical Process Parameter' (CPP)?", "answer": "A parameter in SAP (like a temperature setpoint) that must be monitored and validated as it impacts product quality."},
      { "id": 24, "question": "What is 'Vendor Audit' in the context of CSV?", "answer": "Assessing SAP or a hosting provider to ensure their software development and quality management systems are GxP-compliant."},
      { "id": 25, "question": "What is 'Audit Trail Review'?", "answer": "A periodic check of SAP logs to ensure users are not bypassing GxP controls."}
    ]
  },
  {
    "category": "S/4HANA Cloud (PCE)",
    "cards": [
      { "id": 26, "question": "How does CSV change for S/4HANA PCE compared to On-Premise?", "answer": "Responsibility shifts from infrastructure management to vendor assessment and managed service oversight." },
      { "id": 27, "question": "What is the impact of SAP's 2-year release cycle on PCE validation?", "answer": "It requires a 'Continuous Validation' strategy to handle frequent updates without disrupting GxP status." },
      { "id": 28, "question": "What is the 'Shared Responsibility Model' in PCE CSV?", "answer": "SAP manages the cloud infrastructure (Qualified), while the customer manages the application and data (Validated)." },
      { "id": 29, "question": "How does 'Automated Regression Testing' support PCE CSV?", "answer": "It allows for rapid verification of GxP processes whenever SAP applies patches or upgrades." },
      { "id": 30, "question": "What is a 'Validation Platform' in the PCE model?", "answer": "Using tools like SAP Cloud ALM to manage validation documents and testing in a digital, integrated environment." },
      { "id": 31, "question": "What is the customer's role in PCE Infrastructure Qualification?", "answer": "Reviewing and approving the SOC 1/SOC 2 reports and SAP's own internal validation evidence."},
      { "id": 32, "question": "Does PCE allow for ABAP customization in CSV projects?", "answer": "Yes, but custom code (GAMP Cat 5) requires significantly more validation effort than standard configuration."},
      { "id": 33, "question": "How are SAP PCE 'Managed Services' validated?", "answer": "Through a Service Level Agreement (SLA) and a clear definition of the vendor’s GxP-relevant operational procedures."},
      { "id": 34, "question": "What is 'Cloud Compliance' documentation for PCE?", "answer": "Standard packages provided by SAP to help customers accelerate their validation effort for the PCE environment."},
      { "id": 35, "question": "What is the risk of 'Force-Upgrades' in PCE?", "answer": "Upgrades are mandatory within a certain window; validation must be planned and executed within that fixed timeframe."},
      { "id": 36, "question": "How does BTP (Business Technology Platform) impact PCE validation?", "answer": "Extensions on BTP are 'outside' the core SAP; their integration and data flow must be separately validated."},
      { "id": 37, "question": "What is 'Configuration as Code' in cloud CSV?", "answer": "Treating SAP configurations as auditable data points that can be moved across environments via controlled transports."},
      { "id": 38, "question": "Why is 'Identity Management' (IAM) more critical in PCE?", "answer": "Because the system is accessed over the internet, requiring validated controls for multi-factor authentication and user provisioning."},
      { "id": 39, "question": "What is the role of the 'Qualified Infrastructure' in PCE?", "answer": "It is the foundation (provided by SAP) upon which the customer's validated SAP application sits."},
      { "id": 40, "question": "Does SAP PCE use the V-Model?", "answer": "Yes, but it is often adapted into an 'Agile' V-Model to fit the cloud delivery speed."},
      { "id": 41, "question": "What is 'OQ by SAP'?", "answer": "SAP performs basic functional testing of the standard software, but the customer still must validate their specific configuration."},
      { "id": 42, "question": "How does 'Sandbox' environment use differ in PCE CSV?", "answer": "It is used for the 'Risk Assessment' phase to see how standard SAP features handle GxP requirements before formal build."},
      { "id": 43, "question": "What is a 'Validation Assessment' for PCE notes?", "answer": "Evaluating every SAP Note or Hotfix to see if it touches a GxP-critical part of the system."},
      { "id": 44, "question": "What is the 'One-System' fallacy in cloud?", "answer": "The mistake of thinking cloud validation is just 'signing off' what the vendor gives you; business processes remain the customer's responsibility."},
      { "id": 45, "question": "What is 'Electronic Document Management' (EDMS) for PCE?", "answer": "A validated tool to house all cloud validation evidence (VP, URS, TM, VSR)."},
      { "id": 46, "question": "How are cloud 'Integrations' (e.g., via APIs) validated?", "answer": "By testing the data integrity and security of the connection point between PCE and other systems."},
      { "id": 47, "question": "What is 'SaaS validation' vs 'PCE validation'?", "answer": "PCE offers more control than SaaS, allowing for more detailed custom validation."},
      { "id": 48, "question": "What is 'Release Management' in a validated PCE setup?", "answer": "The controlled process of moving validated configurations from Dev to Test to Production."},
      { "id": 49, "question": "What is 'Tenant Separation' in PCE CSV?", "answer": "Verifying that the customer's GxP data is logically isolated from other customers in the SAP cloud."},
      { "id": 50, "question": "What is 'User Acceptance Testing' (UAT) in PCE?", "answer": "The final stage where business users confirm the cloud system supports their GxP processes in the real world."}
    ]
  },
  {
    "category": "China Compliance",
    "cards": [
      { "id": 51, "question": "What is MLPS 2.0 and its relevance to SAP in China?", "answer": "The Multi-Level Protection Scheme; SAP systems in China must be graded and certified (usually Level 3) for cybersecurity." },
      { "id": 52, "question": "How does PIPL affect SAP user data?", "answer": "Personal Information Protection Law; requires explicit consent and strict controls for any PII stored in or transferred from SAP China." },
      { "id": 53, "question": "What is the 'Golden Tax' integration requirement?", "answer": "SAP China must integrate with the government's tax system for fapiao (invoice) issuance and validation." },
      { "id": 54, "question": "What is the NMPA's stance on SAP CSV?", "answer": "The National Medical Products Administration (China's FDA) requires strict CSV for any SAP system used in drug or device manufacturing." },
      { "id": 55, "question": "What is 'Data Localization' for SAP China?", "answer": "Critical business and personal data generated in China must be stored on servers physically located within China." },
      { "id": 56, "question": "Define 'Cross-Border Data Transfer' (CBDT) in SAP.", "answer": "The legal process of moving data from SAP China to a global HQ, requiring a security assessment by the CAC."},
      { "id": 57, "question": "What is the CAC?", "answer": "Cyberspace Administration of China; the primary regulator for data security and PIPL compliance."},
      { "id": 58, "question": "How does the 'Data Security Law' (DSL) impact SAP projects?", "answer": "It categorizes data and mandates protections based on the impact on national security."},
      { "id": 59, "question": "What is 'MLPS Filing'?", "answer": "The formal process of submitting SAP system security designs to the local Public Security Bureau for approval."},
      { "id": 60, "question": "What is an 'Appointed Third-Party' audit in China CSV?", "answer": "Engaging a China-certified agency to audit the SAP system’s cybersecurity (MLPS) compliance."},
      { "id": 61, "question": "Does SAP China require a 'GB' (Guobiao) standard check?", "answer": "Yes, technical validation often includes checking against specific 'GB' national standards for encryption and security."},
      { "id": 62, "question": "How are 'Fapiao' audits conducted in a validated SAP environment?", "answer": "Validation must prove that the SAP-to-Golden-Tax interface is accurate and tamper-proof."},
      { "id": 63, "question": "What is 'Sensitive Personal Information' under PIPL?", "answer": "Biometric data, medical history, or financial info in SAP that requires even higher levels of protection and consent."},
      { "id": 64, "question": "What is 'De-identification' in SAP China reporting?", "answer": "Removing PII from SAP data before sending it to global dashboards to comply with localization laws."},
      { "id": 65, "question": "What is the 'Cryptographic Law' of China?", "answer": "Requires that SAP systems use government-approved encryption algorithms for data storage and transmission."},
      { "id": 66, "question": "What is a 'Data Protection Impact Assessment' (DPIA)?", "answer": "A mandatory PIPL step to assess risks before processing sensitive data in SAP."},
      { "id": 67, "question": "How does 'NMPA Annex 1' apply to SAP?", "answer": "It provides specific guidelines for computerized systems used in pharmaceutical manufacturing."},
      { "id": 68, "question": "What is the 'Cybersecurity Review' for SAP PCE in China?", "answer": "A review required if an SAP project involves purchasing critical network products that could affect national security."},
      { "id": 69, "question": "What is 'Localization Validation'?", "answer": "Validating the specific SAP China Add-on or local patches that are not part of the global core."},
      { "id": 70, "question": "What is 'Joint and Several Liability' in PIPL?", "answer": "Both the customer and SAP (if it is a service provider) can be held liable for data breaches in the cloud."},
      { "id": 71, "question": "What is 'Self-Assessment' for data export?", "answer": "The internal review a company must do before asking the government for permission to export SAP data."},
      { "id": 72, "question": "How is 'Audit Trail' compliance checked by NMPA?", "answer": "Inspectors look for un-editable logs of every data entry, modification, and deletion in SAP."},
      { "id": 73, "question": "What is 'Network Security Domain' in MLPS?", "answer": "Structuring the SAP network into zones (Production, DMZ) with validated firewalls between them."},
      { "id": 74, "question": "What is the 'Designated Data Handler'?", "answer": "The specific entity in China legally responsible for the SAP data under PIPL."},
      { "id": 75, "question": "What is 'Standard Contractual Clauses' (SCC) in China?", "answer": "The legal templates provided by the CAC for transferring SAP data out of China."}
    ]
  }
];

const allCards = flashcardData.flatMap(cat => 
  cat.cards.map(card => ({ ...card, category: cat.category }))
);

export default function FlashcardApp() {
  const [filter, setFilter] = useState('All');
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (id) => {
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredCards = filter === 'All' 
    ? allCards 
    : allCards.filter(c => c.category.includes(filter));

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">SAP CSV Mastery Portal</h1>
          <p className="mt-2 text-slate-500">Interactive Knowledge Base for Life Sciences Compliance</p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {['All', 'Global', 'Cloud', 'China'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${
                  filter === cat ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat === 'All' ? 'View All 75' : cat}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <div 
              key={card.id}
              onClick={() => toggleFlip(card.id)}
              className="h-56 cursor-pointer group relative"
            >
              <div className={`w-full h-full rounded-2xl p-8 flex items-center justify-center text-center transition-all duration-300 transform hover:-translate-y-1 ${
                flippedCards[card.id] 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' 
                  : 'bg-white border-2 border-slate-100 text-slate-800 shadow-sm hover:border-blue-200'
              }`}>
                <div>
                  <span className={`text-[10px] uppercase font-black tracking-widest block mb-4 ${flippedCards[card.id] ? 'text-blue-200' : 'text-blue-500'}`}>
                    {card.category}
                  </span>
                  <p className="text-base leading-snug font-semibold">
                    {flippedCards[card.id] ? card.answer : card.question}
                  </p>
                  <p className={`mt-4 text-[10px] font-bold uppercase opacity-40`}>
                    {flippedCards[card.id] ? "Click to Flip Back" : "Click to Reveal"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}