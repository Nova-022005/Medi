# MediSage UML State Diagram

## 1. Purpose

This state diagram describes the principal lifecycle of a MediSage clinical
document and the authenticated session that owns it. It shows how the system
moves from an unopened application to an authenticated, profile-scoped
clinical record, and then to traceable timeline, safety, offline emergency,
and FHIR-export outcomes.

The model is intentionally expressed as a UML state machine rather than as a
sequence diagram. Each rounded rectangle represents a stable condition of the
system. Each arrow represents an event, guard, and/or action that causes a
transition to another state.

## 2. Editable diagram source

The authoritative editable diagram is:

- [MediSage_State_Diagram.drawio](MediSage_State_Diagram.drawio)

Open the file in [diagrams.net](https://app.diagrams.net/) or the draw.io
desktop application. The Markdown document and the draw.io file are kept in
the same directory so the link remains portable when the `SD` folder is
copied or published.

```drawio width=800
<mxfile>
  <diagram id="default" name="Page-1">
    <mxGraphModel>
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```


## 3. UML notation used

| Notation | Meaning in this diagram |
| --- | --- |
| Filled black circle | UML initial pseudostate. The state machine begins when the application is opened. |
| Rounded rectangle | A UML state in which the system waits for an event or completes an activity. |
| Arrow | A directed transition between states. |
| `event` | The external or internal trigger for a transition. |
| `[guard]` | A condition that must be true for the transition to be taken. |
| `/ action` | An action performed while the transition is taken. |
| Circle with a filled dot | UML final state. The authenticated session has ended and no further transition is active. |

The initial and final pseudostates are not ordinary business states. They are
shown with the standard UML circle notation, while all business states use
rounded rectangles.

## 4. State catalogue

| State | Responsibility and invariant |
| --- | --- |
| **Unauthenticated** | No active session exists. Protected patient records must not be readable. |
| **Authenticated session** | Credentials have been accepted, a session token is active, and permissions are resolved. |
| **Active profile selected** | Exactly one patient or dependent profile is active for the current operation. Records must remain profile-scoped. |
| **Document received** | A source document has arrived at the upload boundary and awaits allow-list, size, malware, and profile checks. |
| **Upload rejected** | The source cannot enter processing because a boundary check failed. The user can correct the file and retry. |
| **Processing document** | Classification, OCR, structured parsing, and clinical-entity extraction are running. |
| **Processing failed** | Processing could not complete because of a parser, service, or document-quality failure. The source and failure event are retained for diagnosis and retry. |
| **Extraction review** | Extracted values are checked for confidence, source coordinates, dates, units, and provenance completeness. |
| **Needs user verification** | A value is not safe to present as verified because confidence is low or source evidence is incomplete. |
| **Verified clinical record** | Source-linked clinical values have been persisted for the active profile. |
| **Timeline available** | The user can inspect the longitudinal timeline, evidence links, trends, medicines, and allergies. |
| **Safety evaluation** | Rules evaluate drug interactions, allergy cross-reactivity, and selected renal or haemodynamic risks. |
| **Safety alert presented** | A detected risk is shown with an explanation. The alert is informational support, not a prescribing decision. |
| **No safety alert** | Safety rules completed without a detected conflict for the requested check. |
| **Emergency cache refreshed** | Only minimum emergency information, such as allergies, medicines, blood group, and contacts, is available in the encrypted offline cache. |
| **FHIR export prepared** | A validated HL7 FHIR R4 bundle has been generated for the selected profile. |
| **Session ended** | Logout, expiration, or revocation has terminated access to protected records. |

## 5. Transition catalogue

| ID | From | Trigger / guard / action | To |
| --- | --- | --- | --- |
| T1 | Initial | Application opened | Unauthenticated |
| T2 | Unauthenticated | Valid credentials / issue token | Authenticated session |
| T3 | Authenticated session | Select patient or dependent profile | Active profile selected |
| T4 | Active profile selected | Upload document | Document received |
| T5 | Document received | `[type, size, and malware checks fail]` / notify user | Upload rejected |
| T6 | Upload rejected | Correct file and retry | Document received |
| T7 | Document received | `[checks pass]` / create processing job | Processing document |
| T8 | Processing document | `[service or parser error]` / retain source and log event | Processing failed |
| T9 | Processing failed | Retry processing | Processing document |
| T10 | Processing document | Extraction complete | Extraction review |
| T11 | Extraction review | `[confidence low or provenance incomplete]` | Needs user verification |
| T12 | Needs user verification | User verifies or corrects value / attach evidence | Verified clinical record |
| T13 | Extraction review | `[confidence sufficient and provenance complete]` / persist record | Verified clinical record |
| T14 | Verified clinical record | Open timeline | Timeline available |
| T15 | Timeline available | Run medication safety check | Safety evaluation |
| T16 | Safety evaluation | `[risk detected]` / explain mechanism | Safety alert presented |
| T17 | Safety evaluation | `[no risk detected]` | No safety alert |
| T18 | Verified clinical record | Refresh emergency data | Emergency cache refreshed |
| T19 | Verified clinical record | Request FHIR export | FHIR export prepared |
| T20 | Timeline available | Logout, token expiry, or revoke access | Session ended |
| T21 | Safety alert presented | Logout | Session ended |
| T22 | Session ended | Final transition | Final state |

## 6. Normal path

The main successful path is:

1. The application opens at the initial pseudostate.
2. The user authenticates and receives an active session.
3. The user selects a patient or dependent profile.
4. A supported document is uploaded and accepted.
5. MediSage classifies, parses, and extracts the document.
6. Confidence and source provenance are reviewed.
7. The verified record is stored for the selected profile.
8. The record becomes available in the longitudinal timeline.
9. Optional actions can refresh the offline emergency cache, evaluate medication
   safety, or prepare an HL7 FHIR R4 export.
10. Logout, token expiration, or access revocation reaches the final state.

## 7. Exceptional and recovery paths

### Upload rejection

An upload remains outside clinical processing until its type, size, malware,
and profile-scope checks pass. A rejected file is not silently treated as a
clinical record. The user corrects the file and retries from **Upload
rejected** to **Document received**.

### Processing failure

OCR, classification, or parsing can fail because a service is unavailable or
the document is unreadable. The transition records the failure and retains the
source so that retry behavior is explicit. The system must not return a
success-shaped clinical record from this state.

### Low-confidence extraction

An extracted value with insufficient confidence or incomplete provenance moves
to **Needs user verification**. Only after the user verifies or corrects the
value and evidence is attached can it reach **Verified clinical record**.
This protects the traceability requirement.

### Safety result

The safety branch deliberately has two outcomes: **Safety alert presented**
when a risk is detected and **No safety alert** when the evaluated rules find
no conflict. Both outcomes are informational and do not replace clinical
judgement or prescribing authority.

## 8. MediSage requirements represented

- **Profile isolation:** profile selection occurs before document ingestion, and
  the verified record is stored against the active profile.
- **Traceability:** extraction review requires confidence and source
  coordinates before verification.
- **Secure ingestion:** upload validation prevents unsupported, oversized, or
  unsafe files from entering processing.
- **Deterministic failure behavior:** processing failure is visible and
  recoverable rather than silently converted into a valid record.
- **Medication safety:** interaction, allergy, renal, and haemodynamic rules
  have an explicit evaluation and alert outcome.
- **Emergency availability:** only minimum emergency fields are refreshed into
  an encrypted offline cache.
- **Interoperability:** FHIR export is represented as a distinct validated
  state.
- **Session security:** logout, token expiry, and access revocation converge on
  the final state.

## 9. Scope and assumptions

This is a system-level state diagram, not a detailed state machine for every
individual document parser or UI component. The diagram assumes that
authentication, authorization, persistence, audit logging, and source-document
storage are supporting services of the states shown here. It also assumes that
optional AI assistance and insurance matching are separate workflows that
consume verified, profile-scoped data; they do not bypass document validation
or provenance review.
