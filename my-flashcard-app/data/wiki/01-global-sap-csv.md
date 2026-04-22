# Global SAP GxP & CSV

## What is the primary goal of Computer System Validation (CSV) in SAP projects?

To provide documented evidence that the SAP system consistently performs according to its intended use and meets GxP regulatory requirements.

## Explain the relationship between CSV and GxP.

CSV is the process used to ensure that computerized systems (like SAP) comply with GxP (Good Practice) regulations, such as GMP, GDP, and GCP.

## What is the 'V-Model' in the context of SAP CSV?

A SDLC framework that maps requirements (User Requirements, Functional Specs) directly to their corresponding testing phases (IQ, OQ, PQ).

## What does GAMP 5 stand for, and why is it important?

Good Automated Manufacturing Practice (Version 5); it is the industry-standard risk-based approach for compliant GxP computerized systems.

## How does CSV impact the SAP Blueprinting phase?

It requires the early definition of User Requirements (URS) and a Risk Assessment to determine which SAP processes are GxP-relevant.

## What are the common pitfalls in SAP CSV projects?

Underestimating documentation effort, lack of early QA involvement, and failing to define clear system boundaries.

## What is an Installation Qualification (IQ)?

Evidence that the SAP software and hardware infrastructure are installed correctly according to specifications.

## What is an Operational Qualification (OQ)?

Functional testing to verify that the SAP system operates as intended across all operational ranges.

## What is a Performance Qualification (PQ)?

Testing the integrated SAP system under real-world conditions to ensure it consistently meets performance criteria.

## Why is 'Electronic Signature' (21 CFR Part 11) critical in SAP CSV?

It ensures that digital approvals in SAP are as legally binding and traceable as handwritten signatures.

## What is the purpose of a Traceability Matrix (TM)?

To link each requirement (URS) to its functional design (FS), technical build, and final test case (OQ/PQ) for audit readiness.

## How does 'Data Integrity' apply to SAP CSV?

It follows the ALCOA+ principles (Attributable, Legible, Contemporaneous, Original, Accurate) to ensure data is trustworthy throughout its lifecycle.

## What is a 'Validation Summary Report' (VSR)?

The final document that summarizes the validation activities and confirms the system is 'Live' and compliant.

## What is the 'intended use' principle?

The core of CSV; validation is not about the software's features, but whether it works for the specific business process it was designed for.

## How does Change Management intersect with CSV?

Any post-go-live change to a validated SAP system must undergo a formal impact assessment and re-validation if GxP-relevant.

## What is Category 4 vs Category 5 in GAMP 5?

Category 4 is configured software (standard SAP), while Category 5 is custom-coded software (ABAP developments).

## What is a Functional Risk Assessment (FRA)?

A step to identify which specific SAP functions carry high risk to patient safety or product quality.

## Who is responsible for the final 'release' of a validated system?

The Quality Unit (QA) and the System Owner.

## What are peripheral systems in SAP CSV?

External systems (LIMS, MES, WMS) that exchange GxP data with SAP and require interface validation.

## Define 'Legacy System Migration' in CSV.

The process of moving GxP data from an old system to SAP while maintaining data integrity and audit trails.

## What is 'Retrospective Validation'?

Validating an existing system that is already in use but lacks full documentation (rarely recommended today).

## What is a Validation Plan (VP)?

The roadmap defining the scope, responsibilities, and acceptance criteria for the entire SAP validation project.

## What is a 'Critical Process Parameter' (CPP)?

A parameter in SAP (like a temperature setpoint) that must be monitored and validated as it impacts product quality.

## What is 'Vendor Audit' in the context of CSV?

Assessing SAP or a hosting provider to ensure their software development and quality management systems are GxP-compliant.

## What is 'Audit Trail Review'?

A periodic check of SAP logs to ensure users are not bypassing GxP controls.
