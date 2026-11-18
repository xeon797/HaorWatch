# UI & Design Direction — HaorWatch AI

## Design ownership and creative freedom

The frontend developer has full ownership of the visual identity and UI/UX design. This document intentionally does **not** prescribe a fixed palette, typography, spacing scale, component library, page layout, navigation pattern, map style, or dashboard template.

Create a distinctive, high-quality interface that makes complex satellite-derived flood information understandable and useful. Draw inspiration from the landscapes, water systems, seasonal rhythms, and agricultural context of Bangladesh's haor regions if that helps establish a meaningful visual identity.

Explore different directions rather than defaulting to a generic admin dashboard. A map-centric interface, editorial data storytelling, field-intelligence console, or another well-reasoned direction may work. Choose the approach that best serves the product and its users.

## Design decisions owned by the frontend developer

You may independently define:
- Brand identity, color palette, typography, iconography, and visual language.
- Layout, navigation, page hierarchy, responsive behavior, and density.
- Map composition, layer controls, legends, chart types, and data presentation.
- Cards, tables, filters, tooltips, empty states, and report layouts.
- Motion, transitions, interaction patterns, and micro-interactions.
- Component architecture and design tokens.

No visual design shown in this file should be treated as mandatory.

## Functional requirements that must remain intact

The visual design is flexible; product behavior and data integrity are not.

The interface must support the capabilities and journeys described in `prd.md` and `flows.md`, including:
- Study-area overview and latest analysis status.
- Flood map with distinct ML and conventional-baseline layers.
- Agricultural exposure overlay.
- Layer availability, descriptions, legend, and relevant dates.
- Evaluation metrics and validation status when available.
- Data sources, provenance, methodology, and limitations.
- Bangla and English report presentation.
- Loading, empty, partial-data, stale-data, and error states.

## Data integrity and language

- Integrate with the exact API contract in `api.md`; do not invent fields or silently change the contract.
- Never fabricate statistics, map geometries, dates, model scores, or analysis outputs.
- Clearly distinguish live backend data from mock/demo fixtures.
- Treat `null` or unavailable data differently from a measured zero.
- Clearly distinguish custom ML output, thresholding baseline, and external reference data.
- Use the phrase **“potentially exposed agricultural area”**. Do not claim confirmed crop damage or crop loss.
- Do not describe the platform as a flood forecasting or emergency-warning system.
- If a layer is unavailable, communicate that state rather than drawing invented geometry.

## Quality bar

The final experience should feel coherent, intentional, responsive, accessible, and trustworthy. Prioritize clear information hierarchy and map/chart legibility. Use meaningful interactions and visual storytelling where they improve understanding; avoid decoration that obscures uncertainty or data provenance.

The frontend developer should make and own the design decisions. The backend/API contract and product requirements remain the shared constraints.
