


## P R O J E C T   D O C U M E N T A T I O N
MediSage
## Clinical Document Intelligence & Sovereign Health Vault
Next-Generation Longitudinal Health Record  •  Zero-Hallucination OCR Provenance  •  Pharmacodynamic Safety Guard  •
HL7® FHIR® R4 Interoperability



Table of Contents
Table of Contents ................................................................................................................................................................ 2
- Project Title ..................................................................................................................................................................... 3
- Team Members ................................................................................................................................................................ 3
- Problem Background ....................................................................................................................................................... 3
- Problem Statement.......................................................................................................................................................... 3
- Impact ............................................................................................................................................................................. 3
- Proposed Software Solution ............................................................................................................................................ 4
Core Feature Matrix ......................................................................................................................................................... 4
- Technical Feasibility ......................................................................................................................................................... 4
System Architecture ........................................................................................................................................................ 5
Technology Stack ............................................................................................................................................................. 5
- Operational Feasibility ..................................................................................................................................................... 5
- Project Scope ................................................................................................................................................................... 6
In Scope (Current Release, v2.0) ...................................................................................................................................... 6
Out of Scope (Future Roadmap)....................................................................................................................................... 6
- Expected Outcome ......................................................................................................................................................... 6
Medical Disclaimer .............................................................................................................................................................. 6



## 1. Project Title
MediSage — Clinical Document Intelligence & Sovereign Health Vault
Tagline: Next-Generation Longitudinal Health Record, Zero-Hallucination OCR Provenance, Pharmacodynamic
Safety Guard & HL7® FHIR® R4 Interoperability.
## 2. Team Members
## Name Role Responsibility
Yash Singhal Full-Stack Developer Architecture, backend (Node.js/Express),
frontend (React), AI integration
Saurav singh Lead doc
Sparsh singhal devops deployment
Saumya singhal Co-lead docs
## 3. Problem Background
Modern medical management is plagued by fragmented paper prescriptions, disconnected lab PDFs, disjointed
hospital portals, and opaque diagnostic terminology. Patients and attending physicians routinely lose critical
clinical context between encounters, because health records are scattered across:
- Physical paper prescriptions handed out at clinics, easily lost or damaged.
- PDF-based lab reports (CMP, lipid panels, radiology, ECG/Echo summaries) stored in disconnected email
inboxes or hospital portals.
- Inpatient discharge summaries that rarely reach the patient's primary care provider.
- Terminology and biomarker values that are difficult for a layperson to interpret without clinical training.
Without a unified, verifiable, and portable record, patients arrive at new providers or emergency rooms with
incomplete histories, and clinicians must reconstruct a timeline from memory or fragmented paperwork —
increasing the risk of missed drug interactions, repeated tests, and delayed diagnoses.
## 4. Problem Statement
There is no single, trustworthy, and portable system that allows a patient to consolidate all of their clinical
documents (prescriptions, lab reports, radiology, discharge summaries) into one verifiable longitudinal record —
one that a physician, emergency responder, or insurer can instantly trust, that flags dangerous drug interactions
automatically, and that remains accessible even without network connectivity in an emergency.
## 5. Impact
A working solution to this problem would benefit multiple stakeholders across the healthcare ecosystem:

- Patients: A single sovereign vault for their entire medical history, readable trend charts, and an instant
emergency card that could be life-saving in a crisis.
- Physicians: Faster, more accurate context on new patients, verifiable source documents (not AI-guessed
values), and standardized HL7 FHIR data they can import into hospital EHR systems.
- Emergency responders: Immediate access to blood group, allergies, chronic conditions, and current
medications via a scannable QR code — even offline.
- Caregivers / families: A multi-member vault to manage the health records of children, spouses, and aging
parents from one account.
- Insurers: Structured, chronic-condition-aware data that streamlines coverage matching and claims
processing.
## 6. Proposed Software Solution
MediSage is an enterprise-grade, sovereign medical document management and AI health intelligence
ecosystem. Inspired by the zero-trust architecture of government DigiLockers and modern clinical EHR
standards, it digests any clinical artifact, binds every extracted value to its exact source location, and formats the
resulting history into interoperable, portable outputs.
## Core Feature Matrix
- Deterministic Pixel Provenance Viewer — links every extracted biomarker to its exact bounding-box
location on the source document, eliminating AI hallucination, with a SHA-256 provenance hash for
verification.
- Autonomous Clinical OCR & Entity Extraction — multi-format ingestion (PDF, JPEG, PNG, JSON, HL7) with
>98.5% precision and automatic categorization into prescriptions, lab reports, radiology, or discharge
summaries.
- Biomarker Trajectory & Longitudinal Trend Engine — trend graphs across time, automatic delta
calculations, and Optimal/Borderline/Elevated status indicators.
- Pharmacodynamic Drug-Drug & Allergy Safety Guard — CYP450 enzyme pathway checks,
renal/hemodynamic antagonism alerts, allergy cross-reactivity detection, and a prospective-prescription
sandbox simulator.
- Universal Emergency Medical Pass (I.C.E.) & QR Engine — offline-capable emergency triage card with blood
type, contraindications, one-click emergency dialing, and a printable ISO/IEC 7810 wallet card.
- HL7® FHIR® R4 Hospital Passport & JSON Export — US-Core-compliant Patient, Observation,
MedicationStatement, and AllergyIntolerance resource bundles.
- Multi-Member Family & Dependent Vault Switcher — sovereign household management across
dependents with distinct medical profiles.
- AI Clinical Health Synthesis & Conversational Companion — evidence-based longitudinal summaries,
lifestyle/nutrition guidance, and an interactive chat assistant with rule-based fallback.
- Tailored Health Insurance (RCM) Matcher — matches coverage tiers against chronic diagnoses and
medication costs, including waiting periods and preventive-care benefits.
## 7. Technical Feasibility

The proposed architecture relies entirely on mature, widely-adopted, open-source technologies, making the
project technically feasible for a small team to build and maintain:
## System Architecture
- Client Layer: React 19 + Vite, with a botanical design system, interactive EHR viewer/timeline, provenance
inspector, safety guard UI, emergency pass, FHIR exporter, and family profile switcher.
- Backend Layer: Node.js + Express REST API split into Auth, Documents, and AI routers.
- Clinical Intelligence Engine: LOINC biomarker pattern matching, RxNorm pharmacotherapy normalization,
bounding-box spatial provenance, and SIDER/CYP3A4 pharmacodynamic interaction checks.
- Persistence Layer: MongoDB for structured data, encrypted local file storage for uploads, and client-side
IndexedDB/localStorage caching for offline access.
## Technology Stack
## Layer Technologies
Frontend React 19, Vite 6, React Router v7, Tailwind CSS v4, GSAP 3.15, Lucide React, Axios
Backend Node.js (v18/v20), Express 4.18, Mongoose 7.8, JWT + Bcryptjs, Multer, Concurrently
AI / Intelligence LangChain + OpenAI API, with rule-based heuristic fallback when no API key is configured
Standards LOINC, RxNorm, SNOMED CT, HL7® FHIR® R4 (US-Core)
Because the system runs on an in-memory heuristic engine when MongoDB or an OpenAI key is unavailable,
core functionality can be developed, demoed, and evaluated without any paid external dependency — reducing
technical risk during early development.
## 8. Operational Feasibility
The system is designed to be simple to install, run, and verify, supporting smooth day-to-day operation for both
development and evaluation:
- Single-command setup: npm install and npm run dev launch backend (port 5000) and frontend (port 3000)
concurrently.
- Environment configuration is centralized in a single .env file (PORT, MONGODB_URI, JWT_SECRET,
## OPENAI_API_KEY, NODE_ENV).
- An automated API test suite (test-api.js) verifies health checks, registration, login, profile retrieval,
document upload/extraction, AI analysis, insurance matching, and chat — enabling quick regression testing.
- Offline resilience: zero-network fallback with encrypted client-side caching ensures the app remains usable
without a live connection, which is critical for the emergency (I.C.E.) pass use case.
- Security operations are built in from the start: JWT authentication with 7-day expiry, bcrypt password
hashing (10 salt rounds), per-user data isolation, and server-side file sanitization with a 25MB upload limit.
These characteristics indicate that the system can be deployed, maintained, and supported by a small team
without requiring specialized infrastructure or dedicated operations staff.

## 9. Project Scope
In Scope (Current Release, v2.0)
- Zero-hallucination Pixel Provenance Viewer with spatial coordinates.
- Pharmacodynamic Drug-Drug & CYP450 allergy safety guard.
- Universal I.C.E. Emergency Pass with SVG QR code and printable wallet card.
- HL7® FHIR® R4 bundle export and US-Core compliance.
- Multi-profile household and family dependent vault switcher.
- Autonomous OCR & entity extraction, biomarker trend engine, AI health synthesis, and insurance matcher.
Out of Scope (Future Roadmap)
- Native DICOM 3D WebGL viewer for CT & MRI slice inspection (planned v2.1).
- WebRTC end-to-end encrypted telehealth video consultations (planned v2.2).
- Apple HealthKit & Google Health Connect automated vitals sync (planned v2.3).
- Multi-language translation for international emergency triage (planned v2.4).
- Official medical diagnosis, prescriptive authority, or emergency dispatch services — the system is explicitly
informational and educational, not a replacement for licensed medical care.
## 10. Expected Outcome
Upon completion, MediSage is expected to deliver:
- A working web application where a patient can upload any clinical document and receive automatically
extracted, source-verified biomarkers and medications within seconds.
- A drug-safety guard that proactively warns users of dangerous interactions before harm occurs.
- An emergency pass that first responders can access offline in seconds via QR code, potentially saving lives
in critical situations.
- Interoperable HL7 FHIR R4 exports that any modern hospital EHR system can ingest, reducing repeat testing
and administrative friction.
- A single sovereign vault usable by an entire family, replacing scattered paper and PDF records with one
longitudinal, trustworthy health record.
Longer term, the project aims to expand into full telehealth, wearable integration, and multi-language
emergency support, positioning MediSage as a comprehensive personal health record platform.
## Medical Disclaimer
MediSage is a clinical document intelligence and personal health record management system. All AI-generated analyses,
biomarker interpretations, dietary suggestions, and drug interaction alerts are provided strictly for informational and
educational purposes. MediSage does not provide official medical diagnoses, prescriptive authority, or emergency
dispatch services. Always consult a qualified physician regarding any medical condition, symptom, or treatment plan. In
case of a life-threatening emergency, immediately contact local emergency services.