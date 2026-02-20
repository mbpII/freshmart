# Project: Inventory Management System

---

## 1. Project Overview

<!-- Brief description of what the client wants and the approach you're taking. Two or three sentences — this sets context for John so he's oriented before you get into details. -->
The client wants a inventory management system for there grocery store. The system is to handle/track inventory and discounts of both food and non-food products, the will also need to be alerts handling states of low stock, tracking on current inventory sales rates relative to previous sales, suggest discounts on products approaching end of shelf life. Along with exetensibility for reportin reporting. 
---

## 2. Assumptions & Open Questions
<!-- Put this near the top, not buried at the bottom. These are the things you're waiting on John for or decisions you made in the absence of information. Format them clearly so John can respond to each one. -->

### Assumptions
- [Starting from scratch]
- [Assuming there will be one user (this is unlikely but can be extensible)]
- [Assumption 3]

### Open Questions
1. **[What system does the client currently have ?]** — [Based on what they are currently using this could what needs to be built, if they have a current digital system I need only to integrate with it, then add the features they are missing, I could also have a better frame of reference of what the system should work like by having a demonstration.]
2. **[Who will be the main user of this system ? stockers, managers, cashiers, associates, or some other role/position ]** — [By knowing this it can help me better scope the user stories.]
3. **[Question 3]** — [Context/why it matters]

---

## 3. Epics

<!-- List each epic with a one-sentence description of what it covers and why it matters to the business. This is your high-level view before diving into detail. -->

| Epic ID | Name | Description | Business Value |
|---------|------|-------------|----------------|
| EPIC-01 | [Inventory Management] | [add/remove and mark product as discounted ] | [Allows accurate inventory tracking so the business always knows current stock levels and can make informed purchasing decisions] |
| EPIC-02 | [Inventory Monitoring and Alerting] | [will alert the user based on the current stock of the product being low] | [This can allow the buisness to know when products are restock, meaning higher conversion of customers.] |
| EPIC-03 | [Analytics] | [track the velocity of sale] | [this will allow the buisness to know how to handling and order future stock, based on current trends better serving the customor needs.] |
| EPIC-04 | [Liquidation/Expiration Handling] | [suggest recomendations to put items on sale based on proximity to there expiration date] | [this will prevent the grocer from selling items that  have gone bad, and other similar disaterous outcomes] |
| EPIC-05 | [Reporting] | [handling of the ] | [this will prevent the grocer from selling items that  have gone bad, and other similar disaterous outcomes] |
---

## 4. User Stories by Epic

<!-- For each epic, group the stories under it. The ID gives you something to reference in conversation — "let's talk about IM-03" is easier than "that one about the expiration thing." Priority could be simple: Must Have, Should Have, Nice to Have. That's the MoSCoW method. -->

### Epic: [EPIC-01 Name]

| ID | Role | Story | So That | Acceptance Criteria | Priority |
|----|------|-------|---------|-------------------|----------|
| [EPIC-01]-01 | As a [role] | I want to [action] | So that [benefit] | - [Criteria 1]<br>- [Criteria 2]<br>- [Criteria 3] | Must Have |
| [EPIC-01]-02 | As a [role] | I want to [action] | So that [benefit] | - [Criteria 1]<br>- [Criteria 2] | Should Have |

### Epic: [EPIC-02 Name]

| ID | Role | Story | So That | Acceptance Criteria | Priority |
|----|------|-------|---------|-------------------|----------|
| [EPIC-02]-01 | As a [role] | I want to [action] | So that [benefit] | - [Criteria 1]<br>- [Criteria 2] | Must Have |

### Epic: [EPIC-03 Name]

| ID | Role | Story | So That | Acceptance Criteria | Priority |
|----|------|-------|---------|-------------------|----------|
| [EPIC-03]-01 | As a [role] | I want to [action] | So that [benefit] | - [Criteria 1] | Nice to Have |

---

## 5. Roadmap

<!-- Lay out your increments in order: What it delivers, Which stories it covers (reference the IDs), Dependencies, Why it's first. -->

### Increment 1 — [Name]

**What it delivers:**
[Description of deliverables]

**Stories covered:**
- [EPIC-01]-01
- [EPIC-01]-02
- [EPIC-02]-01

**Dependencies:**
- [Dependency 1]
- [Dependency 2]

**Why it's first:**
[Rationale for priority]

---

### Increment 2 — [Name]

**What it delivers:**
[Description of deliverables]

**Stories covered:**
- [Story ID]
- [Story ID]

**Dependencies:**
- [Dependency 1]

**Why it's second:**
[Rationale for priority]

---

### Increment 3 — [Name]

**What it delivers:**
[Description of deliverables]

**Stories covered:**
- [Story ID]

**Dependencies:**
- [Dependency 1]

**Why it's third:**
[Rationale for priority]

---

## 6. Future Considerations

<!-- Features and capabilities identified as valuable but not part of the current roadmap. These inform architectural decisions without expanding current scope. -->

### Reporting Infrastructure

**Status:** Out of Scope for Current Roadmap

**Rationale:** While the system architecture will support future reporting enhancements (as noted in requirements), full reporting capabilities are not included in the initial deliverables. The current epics focus on operational inventory management. However, the database schema and API design should accommodate future reporting features without requiring significant refactoring.

**Future Value:** Once basic inventory operations are stable, reporting will enable the business to analyze long-term trends, identify seasonal patterns, and optimize overall store performance.

---

## 7. Wireframes

<!-- Reference your draw.io screens here. Each wireframe should map back to specific stories — "this screen supports IM-01, IM-02, and IM-04." -->

### Wireframe: [Screen Name]

**File:** `[draw.io filename]`

**Description:**
[Brief description of what this screen does]

**Supports Stories:**
- [Story ID]
- [Story ID]
- [Story ID]

**Key Elements:**
- [Element 1]
- [Element 2]
- [Element 3]

---

### Wireframe: [Screen Name]

**File:** `[draw.io filename]`

**Description:**
[Brief description of what this screen does]

**Supports Stories:**
- [Story ID]
- [Story ID]

**Key Elements:**
- [Element 1]
- [Element 2]

---

## Appendix

### MoSCoW Priority Definitions

- **Must Have** — Critical for launch; system cannot function without this
- **Should Have** — Important but not critical; can work around if missing
- **Nice to Have** — Desirable but not necessary; can be added later

### Glossary

| Term | Definition |
|------|------------|
| [Term] | [Definition] |
| [Term] | [Definition] |

---

*Last updated: [Date]*
